/**
 * Created by Samuel Gratzl on 08.03.2017.
 */

import * as d3 from 'd3';
import * as session from 'phovea_core/src/session';
import AFormElement from './AFormElement';
import {IFormElementDesc, IFormParent, IFormElement} from '../interfaces';


export interface IFormSelectOption {
  name: string;
  value: string;
  data: any;
}


export interface IFormSelectOptions {
  /**
   * Custom on change function that is executed when the selection has changed
   * @param selection
   * @param formElement
   */
  onChange?: (selection: IFormSelectOption, formElement: IFormElement) => any;
  /**
   * Data for the options elements of the select
   */
  optionsData?: (string|IFormSelectOption)[];
  /**
   * Function to generate dynamic options based on the selection of the depending form element
   * @param selection selection of the depending form element (see `dependsOn` property)
   */
  optionsFnc?: (selection: IFormSelectOption[]) => string[]|IFormSelectOption[];
  /**
   * Index of the selected option; this option overrides the selected index from the `useSession` property
   */
  selectedIndex?: number;
}


/**
 * Add specific options for select form elements
 */
export interface IFormSelectDesc extends IFormElementDesc {
  /**
   * Additional options
   */
  options?: IFormSelectOptions;
}

export interface IFormSelectElement extends IFormElement {
  getSelectedIndex(): number;

  updateOptionElements(data: (string|IFormSelectOption)[]): void;
}

/**
 * Select form element instance
 * Propagates the changes from the DOM select element using the internal `change` event
 */
export default class FormSelect extends AFormElement<IFormSelectDesc> implements IFormSelectElement {

  private $select: d3.Selection<any>;

  /**
   * Constructor
   * @param parent
   * @param $parent
   * @param desc
   */
  constructor(parent: IFormParent, $parent: d3.Selection<any>, desc: IFormSelectDesc) {
    super(parent, desc);

    this.$node = $parent.append('div').classed('form-group', true);

    this.build();
  }

  /**
   * Build the label and select element
   * Bind the change listener and propagate the selection by firing a change event
   */
  protected build() {
    super.build();

    this.$select = this.$node.append('select');
    this.setAttributes(this.$select, this.desc.attributes);
    this.handleOptions(this.$select, this.desc.options);
    this.handleShowIf();

    // propagate change action with the data of the selected option
    this.$select.on('change.propagate', () => {
      this.fire('change', d3.select((<HTMLSelectElement>this.$select.node()).selectedOptions[0]).datum(), this.$select);
    });
  }

  /**
   * Handle select form element specific options
   * @param $select
   * @param options
   */
  private handleOptions($select: d3.Selection<any>, options: IFormSelectOptions) {
    if (!options) {
      return;
    }

    // custom on change function
    if (options.onChange) {
      $select.on('change.customListener', () => {
        options.onChange(this.value, this);
      });
    }

    let optionsData = options.optionsData;

    if (this.desc.dependsOn && options.optionsFnc) {
      const dependElements = this.desc.dependsOn.map((depOn) => this.parent.getElementById(depOn));

      const values = <IFormSelectOption[]>dependElements.map((d) => d.value);
      optionsData = options.optionsFnc(values);

      const onDependentChange = () => {
        const values = <IFormSelectOption[]>dependElements.map((d) => d.value);
        this.updateOptionElements(options.optionsFnc(values));
        $select.property('selectedIndex', options.selectedIndex || 0);

        // propagate that options has changed
        this.fire('change', this.value, $select);
      };

      dependElements.forEach((depElem) => {
        depElem.on('change', onDependentChange);
      });
    }

    let defaultSelectedIndex = 0;
    if (this.desc.useSession) {
      defaultSelectedIndex = session.retrieve(this.id + '_selectedIndex', defaultSelectedIndex);

      // old selected index is out of bounce for current number of options -> set to 0
      if (optionsData.length <= defaultSelectedIndex) {
        defaultSelectedIndex = 0;
      }

      $select.on('change.storeInSession', () => {
        session.store(this.id + '_selectedIndex', (<HTMLSelectElement>$select.node()).selectedIndex);
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

    if (this.desc.useSession) {
      defaultSelectedIndex = session.retrieve(this.id + '_selectedIndex', defaultSelectedIndex);
    }

    return (currentSelectedIndex === -1) ? defaultSelectedIndex : currentSelectedIndex;
  }

  /**
   * Update the options of a select form element using the given data array
   * @param data
   */
  updateOptionElements(data: (string|IFormSelectOption)[]) {
    const options: IFormSelectOption[] = data.map((d) => {
      if (typeof d === 'string') {
        return {name: d, value: d, data: d};
      }
      return <IFormSelectOption>d;
    });

    const $options = this.$select.selectAll('option').data(options);
    $options.enter().append('option');

    $options.attr('value', (d) => d.value)
      .html((d) => d.name);

    $options.exit().remove();
  }

  /**
   * Returns the selected value or if nothing found `null`
   * @returns {string|{name: string, value: string, data: any}|null}
   */
  get value() {
    const option = d3.select((<HTMLSelectElement>this.$select.node()).selectedOptions[0]);
    return (option.size() > 0) ? option.datum() : null;
  }

  /**
   * Select the option by value. If no value found, then the first option is selected.
   * @param v If string then compares to the option value property. Otherwise compares the object reference.
   */
  set value(v: any) {
    // if value is undefined or null, set to first index
    if (!v) {
      this.$select.property('selectedIndex', 0);
      return;
    }

    this.$select.selectAll('option').data().forEach((d, i) => {
      if ((v.value && d.value === v.value) || d.value === v || d === v) {
        this.$select.property('selectedIndex', i);
      }
    });
  }

}
