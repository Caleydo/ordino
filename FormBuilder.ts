/**
 * Created by Holger Stitz on 11.08.2016.
 */

/// <amd-dependency path="select2" />

import {mixin, random_id} from '../caleydo_core/main';
import {EventHandler, IEventHandler} from '../caleydo_core/event';
import session = require('../caleydo_core/session');
import {api2absURL} from '../caleydo_core/ajax';

/**
 * Builds a form from a given collection of form elements
 */
export class FormBuilder {

  /**
   * DOM node for the form itself
   */
  private $node;

  /**
   * Unique id for every form and all the form elements
   * @type {string}
   */
  private formId = random_id();

  /**
   * Map of all appended form elements with the element id as key
   * @type {d3.Map<IFormElement>}
   */
  private elements:d3.Map<IFormElement> = d3.map<IFormElement>();

  /**
   * Constructor
   * @param $parent Node that the form should be attached to
   */
  constructor($parent) {
    this.$node = $parent.append('form');
  }

  /**
   * Builds a form from a list of given form element descriptions
   * @param elements
   */
  build(elements:IFormElementDesc[]) {
    elements.map((el) => {
      this.appendElement(el);
    });
  }

  /**
   * Creates a form element instance from a form element description and
   * appends it to the form
   * @param elementDesc
   */
  appendElement(elementDesc:IFormElementDesc) {
    // inject formId into form element id
    const uid = elementDesc.id + '_' + this.formId;

    elementDesc.attributes = elementDesc.attributes || {};
    elementDesc.attributes.id = uid; // add id as attribute
    elementDesc.attributes.clazz = elementDesc.attributes.clazz || '';
    elementDesc.attributes.clazz += ' form-control';

    switch (elementDesc.type) {
      case FormElementType.SELECT:
        this.elements.set(elementDesc.id, new FormSelect(this, this.$node, elementDesc));
        break;
      case FormElementType.SELECT2:
        this.elements.set(elementDesc.id, new FormSelect2(this, this.$node, elementDesc));
        break;
      case FormElementType.INPUT_TEXT:
        this.elements.set(elementDesc.id, new FormInputText(this, this.$node, elementDesc));
        break;
    }
  }

  /**
   * Returns the form element instance, if exists. Otherwise returns `null`.
   * @param id
   * @returns {IFormElement}
   */
  getElementById(id:string):IFormElement {
    return this.elements.get(id);
  }

  /**
   * Returns an object with the form element id as key and the current data as value
   * @returns {{}}
   */
  getElementData():any {
    const r = {};
    this.elements.forEach((key, el) => {
      r[key] = el.value.data || el.value;
    });
    return r;
  }

  /**
   * Returns an object with the form element id as key and the current form element value
   * @returns {{}}
   */
  getElementValues():any {
    const r = {};
    this.elements.forEach((key, el) => {
      r[key] = el.value.value || el.value;
    });
    return r;
  }

}

/**
 * List of all available for elements that the form builder can handle
 * @see FormBuilder.appendElement()
 */
export enum FormElementType {
  SELECT,
  SELECT2,
  INPUT_TEXT
}

/**
 * The description is used to build the form element
 */
export interface IFormElementDesc {
  /**
   * Choose a type which element should be created
   */
  type: FormElementType;

  /**
   * Unique identifier for each page
   */
  id: string;

  /**
   * Label for the form element
   */
  label: string;

  /**
   * Show or hide form element
   */
  visible?: boolean;

  /**
   * Attributes that are applied to the DOM element
   */
  attributes?: {
    /**
     * Note: Used `clazz` instead of the DOM property `class`, due to JS reserved keyword
     */
    clazz?: string,
    /**
     * Id attribute can be set independently from the `id` property above or will be copied if empty
     */
    id?: string,
    /**
     * Style attribute
     */
    style?: string
  };

  /**
   * Id of a different form element where an on change listener is attached to
   */
  dependsOn?: string[];

  /**
   *
   */
  showIf?:(dependantValue:any[]) => boolean;

  /**
   * Whether to store the value in a session or not
   */
  useSession?: boolean;

  /**
   * Form element specific options
   */
  options?: {};
}

/**
 * Describes public properties of a form element instance
 */
interface IFormElement extends IEventHandler {
  /**
   * Unique identifier of the element within the form
   */
  id: string;

  /**
   * Form element value
   */
  value: any;

  /**
   * Set the visibility of an form element
   * @param visible
   */
  setVisible(visible:boolean);
}

/**
 * Abstract form element class that is used as parent class for other form elements
 */
abstract class AFormElement extends EventHandler implements IFormElement {

  public id;

  protected $node;

  /**
   * Constructor
   * @param formBuilder
   * @param $parent
   * @param desc
   */
  constructor(public formBuilder:FormBuilder, $parent, protected desc:IFormElementDesc) {
    super();

    this.id = desc.id;
  }

  /**
   * Set the visibility of an form element
   * @param visible
   */
  public setVisible(visible:boolean) {
    this.$node.classed('hidden', !visible);
  }

  /**
   * Set a list of object properties and values to a given node
   * Note: Use `clazz` instead of the attribute `class` (which is a reserved keyword in JavaScript)
   * @param $node
   * @param attributes Plain JS object with key as attribute name and the value as attribute value
   */
  protected setAttributes($node, attributes) {
    if(!attributes) {
      return;
    }

    for(let key in attributes) {
      // skip loop if the property is from prototype
      if(!attributes.hasOwnProperty(key)) {
        continue;
      }

      $node.attr((key === 'clazz') ? 'class' : key, attributes[key]);
    }
  }

  protected handleShowIf() {
    if(!this.desc.dependsOn || !this.desc.showIf) {
      return;
    }

    const dependElements = this.desc.dependsOn.map((depOn) => this.formBuilder.getElementById(depOn));

    dependElements.forEach((depElem) => {
      depElem.on('change', (evt, value) => {
        const values = dependElements.map((d) => d.value);
        return this.$node.classed('hidden', !this.desc.showIf(values));
      });
    });

    const values = dependElements.map((d) => d.value);
    this.$node.classed('hidden', !this.desc.showIf(values));
  }

  /**
   * Returns the form element value
   * @returns {string}
   */
  get value() {
    // hook
    return 'Override AFormElement.value';
  }

  /**
   * Set the form element value
   * @param v
   */
  set value(v:string) {
    // hook
  }
}


/**
 * Add specific options for select form elements
 */
export interface IFormSelectDesc extends IFormElementDesc {
  /**
   * Additional options
   */
  options?: {
    /**
     * Custom on change function that is executed when the selection has changed
     * @param selection
     * @param formElement
     */
    onChange?: (selection:{name:string, value:string, data:any}, formElement:IFormElement) => any,
    /**
     * Data for the options elements of the select
     */
    optionsData?: string[]|{name: string, value: string, data: any}[],
    /**
     * Function to generate dynamic options based on the selection of the depending form element
     * @param selection selection of the depending form element (see `dependsOn` property)
     */
    optionsFnc?: (selection:{name:string, value:string, data:any}) => string[]|{name: string, value: string, data: any}[],
    /**
     * Index of the selected option; this option overrides the selected index from the `useSession` property
     */
    selectedIndex?: number
  };
}

/**
 * Add specific functions for select form element
 */
export interface IFormSelectElement extends IFormElement {
  /**
   * Update the options of a select form element using the given data array
   * @param data
   */
  updateOptionElements(data:string[]|{name: string, value: string, data: any}[]):void;

  /**
   * Returns the selectedIndex. If the option `useSession` is enabled,
   * the index from the session will be used as fallback
   */
  getSelectedIndex():number;
}

/**
 * Select form element instance
 * Propagates the changes from the DOM select element using the internal `change` event
 */
class FormSelect extends AFormElement implements IFormSelectElement {

  private $select;

  /**
   * Constructor
   * @param formBuilder
   * @param $parent
   * @param desc
   */
  constructor(public formBuilder:FormBuilder, $parent, protected desc:IFormSelectDesc) {
    super(formBuilder, $parent, desc);

    this.$node = $parent.append('div').classed('form-group', true);

    this.build();
  }

  /**
   * Build the label and select element
   * Bind the change listener and propagate the selection by firing a change event
   */
  private build() {
    if(this.desc.visible === false) {
      this.$node.classed('hidden', true);
    }

    this.$node.append('label').attr('for', this.desc.attributes.id).text(this.desc.label);

    this.$select = this.$node.append('select');
    this.setAttributes(this.$select, this.desc.attributes);
    this.handleOptions(this.$select, this.desc.options);
    this.handleShowIf();

    // propagate change action with the data of the selected option
    this.$select.on('change.propagate', () => {
      this.fire('change', d3.select(this.$select.node().selectedOptions[0]).datum(), this.$select);
    });
  }

  /**
   * Handle select form element specific options
   * @param $select
   * @param options
   */
  private handleOptions($select, options) {
    if(!options) {
      return;
    }

    // custom on change function
    if(options.onChange) {
      $select.on('change.customListener', () => {
        options.onChange(this.value, this);
      });
    }

    let optionsData = options.optionsData;

    if(this.desc.dependsOn && options.optionsFnc) {
      const dependElements = this.desc.dependsOn.map((depOn) => this.formBuilder.getElementById(depOn));

      dependElements.forEach((depElem) => {
        const values = dependElements.map((d) => d.value);
        optionsData = options.optionsFnc(values);

        depElem.on('change', (evt, value) => {
          const values = dependElements.map((d) => d.value);
          this.updateOptionElements(options.optionsFnc(values));
          $select.property('selectedIndex', options.selectedIndex || 0);

          // propagate that options has changed
          this.fire('change', this.value, $select);
        });
      });
    }

    let defaultSelectedIndex = 0;
    if(this.desc.useSession) {
      defaultSelectedIndex = session.retrieve(this.id + '_selectedIndex', defaultSelectedIndex);

      // old selected index is out of bounce for current number of options -> set to 0
      if(optionsData.length <= defaultSelectedIndex) {
        defaultSelectedIndex = 0;
      }

      $select.on('change.storeInSession', () => {
        session.store(this.id + '_selectedIndex', $select.node().selectedIndex);
      });
    }

    this.updateOptionElements(optionsData);

    $select.property('selectedIndex', options.selectedIndex || defaultSelectedIndex);
  }

  /**
   * Returns the selectedIndex. If the option `useSession` is enabled,
   * the index from the session will be used as fallback
   */
  getSelectedIndex() {
    let defaultSelectedIndex = 0;
    const currentSelectedIndex = this.$select.property('selectedIndex');

    if(this.desc.useSession) {
      defaultSelectedIndex = session.retrieve(this.id + '_selectedIndex', defaultSelectedIndex);
    }

    return (currentSelectedIndex === -1) ? defaultSelectedIndex : currentSelectedIndex;
  }

  /**
   * Update the options of a select form element using the given data array
   * @param data
   */
  updateOptionElements(data) {
    data = data.map((d) => {
      return {
        name: (d.name) ? d.name : d,
        value: (d.value) ? d.value : d,
        data: (d.data) ? d.data : d
      };
    });

    const $options = this.$select.selectAll('option').data(data);
    $options.enter().append('option');

    $options
      .attr('value', (d) => d.value)
      .html((d) => d.name);

    $options.exit().remove();
  }

  /**
   * Returns the selected value or if nothing found `null`
   * @returns {string|{name: string, value: string, data: any}|null}
   */
  get value() {
    let option = d3.select(this.$select.node().selectedOptions[0]);
    return (option.size() > 0) ? option.datum() : null;
  }

  /**
   * Select the option by value. If no value found, then the first option is selected.
   * @param v If string then compares to the option value property. Otherwise compares the object reference.
   */
  set value(v:any) {
    // if value is undefined or null, set to first index
    if(!v) {
      this.$select.property('selectedIndex', 0);
      return;
    }

    this.$select.selectAll('option').data().forEach((d, i) => {
      if((v.value && d.value === v.value) || d.value === v || d === v) {
        this.$select.property('selectedIndex', i);
      }
    });
  }

}

/**
 * Add specific options for select form elements
 */
export interface IFormSelect2 extends IFormSelectDesc {
  /**
   * Additional options
   */
  options?: {
    /**
     * URL to data provider backend
     */
    dataProviderUrl?: string;
  };
}

/**
 * Select2 drop down field with integrated search field and communication to external data provider
 * Propagates the changes from the DOM select element using the internal `change` event
 */
class FormSelect2 extends AFormElement {

  private $select; // jQuery

  /**
   * Constructor
   * @param formBuilder
   * @param $parent
   * @param desc
   */
  constructor(public formBuilder:FormBuilder, $parent, protected desc:IFormSelect2) {
    super(formBuilder, $parent, desc);

    this.$node = $parent.append('div').classed('form-group', true);

    this.build();
  }

  /**
   * Build the label and select element
   * Bind the change listener and propagate the selection by firing a change event
   */
  private build() {
    if(this.desc.visible === false) {
      this.$node.classed('hidden', true);
    }

    this.$node.append('label').attr('for', this.desc.attributes.id).text(this.desc.label);

    const $select = this.$node.append('select');
    this.setAttributes($select, this.desc.attributes);

    this.$select = this.buildSelect2($select, this.desc.options);

    this.handleOptions(this.$select, this.desc.options);
    this.handleShowIf();

    // propagate change action with the data of the selected option
    this.$select.on('change.propagate', () => {
      this.fire('change', this.value, this.$select);
    });
  }

  /**
   * Builds the jQuery select2
   * @param $select
   * @param options
   * @returns {JQuery}
   */
  private buildSelect2($select, options) {
    if(!options) {
      return;
    }

    let defaultData = [];

    if(this.desc.useSession) {
      const defaultVal:any = session.retrieve(this.id + '_defaultVal', '');
      defaultData = (defaultVal.id && defaultVal.text) ? [defaultVal] : [{id: defaultVal, text: defaultVal}];
    }

    const defaultOptions = {
      data: defaultData,
      placeholder: 'Start typing...',
      theme: 'bootstrap',
      minimumInputLength: 1,
      //selectOnClose: true,
      //tokenSeparators: [' ', ',', ';'], // requires multiple attribute for select element
      ajax: {
        url: api2absURL('url_needed'), // URL
        dataType: 'json',
        delay: 250,
        cache: true,
        data: (params:any) => {
          return {
            query: params.term, // search term from select2
            page: params.page
          };
        },
        processResults: (data, params) => {
          params.page = params.page || 1;
          return {
            results: data.items,
            pagination: { // indicate infinite scrolling
              more: (params.page * data.items_per_page) < data.total_count
            }
          };
        }
      },
      escapeMarkup: (markup) => markup,
      templateResult: (item:any) => item.text,
      templateSelection: (item:any) => item.text
    };

    mixin(defaultOptions, options);
    //console.log(defaultOptions);

    return $($select.node()).select2(defaultOptions).trigger('change');
  }

  /**
   * Handle select form element specific options
   * @param $select
   * @param options
   */
  private handleOptions($select, options) {
    if(!options) {
      return;
    }

    // custom on change function
    if(options.onChange) {
      this.$select.on('change.customListener', () => {
        options.onChange(this.value, $select);
      });
    }

    let optionsData = options.optionsData;

    if(this.desc.dependsOn && options.optionsFnc) {
      const dependElements = this.desc.dependsOn.map((depOn) => this.formBuilder.getElementById(depOn));

      dependElements.forEach((depElem) => {
        const values = dependElements.map((d) => d.value);
        optionsData = options.optionsFnc(values);

        depElem.on('change', (evt, value) => {
          // propagate that options has changed
          this.fire('change', this.value, $select);
        });
      });
    }

    if(this.desc.useSession) {
      this.$select.on('change.storeInSession', () => {
        session.store(this.id + '_defaultVal', this.value);
      });
    }
  }

  /**
   * Returns the selected value or if nothing found `null`
   * @returns {string|{name: string, value: string, data: any}|null}
   */
  get value() {
    const r = {id: '', text: ''}; // select2 default format

    if(this.$select.val() !== null) {
      r.id = this.$select.select2('data')[0].id;
      r.text = this.$select.select2('data')[0].text;
    }

    return r;
  }

  /**
   * Select the option by value. If no value found, then the first option is selected.
   * @param v If string then compares to the option value property. Otherwise compares the object reference.
   */
  set value(v:any) {
    // if value is undefined or null, clear
    if(!v) {
      this.$select.trigger('clear');
    }

    const r = {id: v, text: v};

    if((v.name || v.text) && (v.value || v.id)) {
      r.id = v.value || v.id;
      r.text = v.name || v.text;
    }

    this.$select.val(r).trigger('change');
  }

}



/**
 * Add specific options for input form elements
 */
export interface IFormInputTextDesc extends IFormElementDesc {
  /**
   * Additional options
   */
  options?: {};
}

/**
 * Add specific functions for input form element
 */
export interface IFormInputTextElement extends IFormElement {

}

/**
 * Input text field element instance
 * Propagates the changes from the DOM select element using the internal `change` event
 */
class FormInputText extends AFormElement implements IFormInputTextElement {

  private $input;

  /**
   * Constructor
   * @param formBuilder
   * @param $parent
   * @param desc
   */
  constructor(public formBuilder: FormBuilder, $parent, protected desc:IFormInputTextDesc) {
    super(formBuilder, $parent, desc);

    this.$node = $parent.append('div').classed('form-group', true);

    this.build();
  }

  /**
   * Build the label and input element
   * Bind the change listener and propagate the selection by firing a change event
   */
  private build() {
    if(this.desc.visible === false) {
      this.$node.classed('hidden', true);
    }

    this.$node.append('label').attr('for', this.desc.attributes.id).text(this.desc.label);

    this.$input = this.$node.append('input').attr('type', 'text');
    this.setAttributes(this.$input, this.desc.attributes);
    this.handleShowIf();

    // propagate change action with the data of the selected option
    this.$input.on('change.propagate', () => {
      this.fire('change', this.value, this.$input);
    });
  }

  /**
   * Returns the value
   * @returns {string}
   */
  get value() {
    return this.$input.node().value;
  }

  /**
   * Sets the value
   * @param v
   */
  set value(v:string) {
    this.$input.node().value = v;
  }
}
