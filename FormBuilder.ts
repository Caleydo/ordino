/**
 * Created by Holger Stitz on 11.08.2016.
 */

import {random_id} from '../caleydo_core/main';
import {EventHandler, IEventHandler} from '../caleydo_core/event';
import session = require('../caleydo_core/session');

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
        this.elements.set(elementDesc.id, new FormSelect(this, this.$node, elementDesc.id, elementDesc.label, elementDesc.attributes, elementDesc.options));
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
    var r = {};
    this.elements.forEach((key, el) => {
      r[key] = el.value.data;
    });
    return r;
  }

  /**
   * Returns an object with the form element id as key and the current form element value
   * @returns {{}}
   */
  getElementValues():any {
    var r = {};
    this.elements.forEach((key, el) => {
      r[key] = el.value.value;
    });
    return r;
  }

}

/**
 * List of all available for elements that the form builder can handle
 * @see FormBuilder.appendElement()
 */
export enum FormElementType {
  SELECT
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
    id?: string
  };

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
}

/**
 * Abstract form element class that is used as parent class for other form elements
 */
abstract class AFormElement extends EventHandler implements IFormElement {

  /**
   * Constructor
   * @param formBuilder
   * @param $parent
   * @param id
   * @param label
   * @param attributes
   * @param options
   */
  constructor(public formBuilder:FormBuilder, $parent, public id, protected label, protected attributes, protected options) {
    super();
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
     * Id of a different form element where an on change listener is attached to
     */
    dependsOn?: string,
    /**
     * Function to generate dynamic options based on the selection of the depending form element
     * @param selection selection of the depending form element (see `dependsOn` property)
     */
    optionsFnc?: (selection:{name:string, value:string, data:any}) => string[]|{name: string, value: string, data: any}[],
    /**
     * Index of the selected option; this option overrides the selected index from the `useSession` property
     */
    selectedIndex?: number,
    /**
     * Whether to store the selected index in a session or not
     * The selected index can be overriden from the `selectedIndex` property
     */
    useSession?: boolean
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
}

/**
 * Select form element instance
 * Propagates the changes from the DOM select element using the internal `change` event
 */
export class FormSelect extends AFormElement implements IFormSelectElement {

  private $node;
  private $select;

  /**
   * Constructor
   * @param formBuilder
   * @param $parent
   * @param id
   * @param label
   * @param attributes
   * @param options
   */
  constructor(public formBuilder:FormBuilder, $parent, public id, protected label, protected attributes, protected options) {
    super(formBuilder, $parent, id, label, attributes, options);

    this.$node = $parent.append('div').classed('form-group', true);

    this.build();
  }

  /**
   * Build the label and select element
   * Bind the change listener and propagate the selection by firing a change event
   */
  private build() {
    this.$node.append('label').attr('for', this.id).text(this.label);

    this.$select = this.$node.append('select');
    this.setAttributes(this.$select, this.attributes);
    this.handleOptions(this.$select, this.options);

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

    var optionsData = options.optionsData;

    if(options.dependsOn) {
      const dependElement = this.formBuilder.getElementById(options.dependsOn);

      if(!dependElement) {
        console.warn(`FormElement "${this.id}" depends on FormElement "${options.dependsOn}" that does not exists or might be defined later`);

      } else if(!options.optionsFnc) {
        console.warn(`FormElement "${this.id}" depends on FormElement "${options.dependsOn}", but the property "optionFnc" is not defined`);

      } else {
        optionsData = options.optionsFnc(dependElement.value);

        dependElement.on('change', (evt, value) => {
          this.updateOptionElements(options.optionsFnc(value));
          $select.property('selectedIndex', options.selectedIndex || 0);

          // propagate that options has changed
          this.fire('change', this.value, $select);
        });
      }
    }

    var defaultSelectedIndex = 0;
    if(options.useSession) {
      defaultSelectedIndex = session.retrieve(this.id + '_selectedIndex', defaultSelectedIndex);
      $select.on('change.storeInSession', () => {
        session.store(this.id + '_selectedIndex', $select.node().selectedIndex);
      });
    }

    this.updateOptionElements(optionsData);

    $select.property('selectedIndex', options.selectedIndex || defaultSelectedIndex);
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
      .text((d) => d.name);

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
  set value(v:string) {
    // if value is undefined or null, set to first index
    if(!v) {
      this.$select.property('selectedIndex', 0);
      return;
    }

    this.$select.selectAll('option').data().forEach((d, i) => {
      if(d === v || d.value === v) {
        this.$select.property('selectedIndex', i);
      }
    });
  }

}
