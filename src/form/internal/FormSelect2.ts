/**
 * Created by Samuel Gratzl on 08.03.2017.
 */

import 'select2';
import * as d3 from 'd3';
import * as $ from 'jquery';
import {mixin} from 'phovea_core/src/index';
import * as session from 'phovea_core/src/session';
import {api2absURL} from 'phovea_core/src/ajax';
import AFormElement from './AFormElement';
import {IFormParent} from '../interfaces';
import {IFormSelectDesc} from './FormSelect';


/**
 * Add specific options for select form elements
 */
export interface IFormSelect2 extends IFormSelectDesc {
  /**
   * Additional options
   */
  options?: {
    /**
     * URL to data provider backend, returning {id: string|number, text: string}[]
     */
    dataProviderUrl?: string;
  };
}


export const DEFAULT_OPTIONS = {
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
      data: (params: any) => {
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
    templateResult: (item: any) => item.text,
    templateSelection: (item: any) => item.text
  };

/**
 * Select2 drop down field with integrated search field and communication to external data provider
 * Propagates the changes from the DOM select element using the internal `change` event
 */
export default class FormSelect2 extends AFormElement<IFormSelect2> {

  private $select: JQuery;

  /**
   * Constructor
   * @param parent
   * @param $parent
   * @param desc
   */
  constructor(parent: IFormParent, $parent, desc: IFormSelect2) {
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
  private buildSelect2($select: d3.Selection<any>, options?) {
    if (!options) {
      return;
    }

    let defaultData = [];

    if (this.desc.useSession) {
      const defaultVal: any = session.retrieve(this.id + '_defaultVal', '');
      defaultData = (defaultVal.id && defaultVal.text) ? [defaultVal] : [{id: defaultVal, text: defaultVal}];
    }

    const select2Options = {
      data: defaultData
    };

    mixin(select2Options, DEFAULT_OPTIONS, options);
    //console.log(defaultOptions);

    return (<any>$($select.node())).select2(select2Options).trigger('change');
  }

  /**
   * Handle select form element specific options
   * @param $select
   * @param options
   */
  private handleOptions($select, options) {
    if (!options) {
      return;
    }

    // custom on change function
    if (options.onChange) {
      this.$select.on('change.customListener', () => {
        options.onChange(this.value, $select);
      });
    }

    let optionsData = options.optionsData;

    if (this.desc.dependsOn && options.optionsFnc) {
      const dependElements = this.desc.dependsOn.map((depOn) => this.parent.getElementById(depOn));

      dependElements.forEach((depElem) => {
        const values = dependElements.map((d) => d.value);
        optionsData = options.optionsFnc(values);

        depElem.on('change', (evt, value) => {
          // propagate that options has changed
          this.fire('change', this.value, $select);
        });
      });
    }

    if (this.desc.useSession) {
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

    if (this.$select.val() !== null) {
      r.id = this.$select.select2('data')[0].id;
      r.text = this.$select.select2('data')[0].text;
    }

    return r;
  }

  /**
   * Select the option by value. If no value found, then the first option is selected.
   * @param v If string then compares to the option value property. Otherwise compares the object reference.
   */
  set value(v: any) {
    // if value is undefined or null, clear
    if (!v) {
      this.$select.trigger('clear');
    }

    const r = {id: v, text: v};

    if ((v.name || v.text) && (v.value || v.id)) {
      r.id = v.value || v.id;
      r.text = v.name || v.text;
    }

    this.$select.val(<any>r).trigger('change');
  }

}
