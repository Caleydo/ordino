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
  options?: Select2Options & {
    return?: 'text'|'id';
  };
}

export interface ISelect2Option {
  id: string;
  text: string;
}

export const DEFAULT_OPTIONS = {
    placeholder: 'Start typing...',
    theme: 'bootstrap',
    minimumInputLength: 0,
    //selectOnClose: true,
    //tokenSeparators: [' ', ',', ';'], // requires multiple attribute for select element
    escapeMarkup: (markup) => markup,
    templateResult: (item: any) => item.text,
    templateSelection: (item: any) => item.text
  };

export const DEFAULT_AJAX_OPTIONS = Object.assign({
  ajax: {
    url: api2absURL('url_needed'), // URL
    dataType: 'json',
    delay: 250,
    cache: true,
    data: (params: any) => {
      return {
        query: params.term === undefined ? '': params.term, // search term from select2
        page: params.page === undefined ? 0: params.page
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
  }
}, DEFAULT_OPTIONS);

/**
 * Select2 drop down field with integrated search field and communication to external data provider
 * Propagates the changes from the DOM select element using the internal `change` event
 */
export default class FormSelect2 extends AFormElement<IFormSelect2> {

  private $select: JQuery;

  private readonly multiple: boolean;

  /**
   * Constructor
   * @param parent
   * @param $parent
   * @param desc
   */
  constructor(parent: IFormParent, $parent, desc: IFormSelect2, multiple: 'multiple'|'single' = 'single') {
    super(parent, desc);

    this.$node = $parent.append('div').classed('form-group', true);
    this.multiple = multiple === 'multiple';

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
      options = {};
    }
    const select2Options: any = {};

    let initialValue: string[] = [];
    if (this.desc.useSession) {
      const defaultVal: any = session.retrieve(this.id + '_defaultVal', null);
      if (defaultVal) {
        if (this.multiple) {
          const defaultValues = Array.isArray(defaultVal) ? defaultVal : [defaultVal];
          initialValue = defaultValues.map((d) => typeof d === 'string' ? d : d.id);
          if (!options.data) { //derive default data if none is set explictly
            select2Options.data = defaultValues.map((d) => (typeof d === 'string' ? ({id: d, text: d}) : d));
          }
        } else {
          initialValue = [typeof defaultVal === 'string' ? defaultVal : <string>defaultVal.id];
          if (!options.data) {
            select2Options.data = [typeof defaultVal === 'string' ? ({id: defaultVal, text: defaultVal}) : defaultVal];
          }
        }
      }
    }

    if (this.multiple) {
      select2Options.multiple = true;
      select2Options.allowClear = true;
    }
    mixin(select2Options, options.ajax ? DEFAULT_AJAX_OPTIONS : DEFAULT_OPTIONS, options);

    return (<any>$($select.node())).select2(select2Options).val(initialValue).trigger('change');
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
        options.onChange(this.value, this);
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
  get value(): (ISelect2Option|string)|(ISelect2Option|string)[] {
    const returnValue = this.desc.options.return;
    const returnF = returnValue === 'id' ? (d) => d.id : (returnValue === 'text' ? (d) => d.text : (d) => d);
    const data = this.$select.select2('data').map((d) => ({id: d.id, text: d.text})).map(returnF);
    if (this.multiple) {
      return data;
    } else if (data.length === 0) {
      return returnF({id: '', text: ''});
    } else {
      return data[0];
    }
  }

  hasValue() {
    const v = this.value;
    if (this.multiple) {
      return (<any[]>v).length > 0;
    } else {
      return v !== '' || (<any>v).id !== '';
    }
  }

  /**
   * Select the option by value. If no value found, then the first option is selected.
   * @param v If string then compares to the option value property. Otherwise compares the object reference.
   */
  set value(v: (ISelect2Option|string)|(ISelect2Option|string)[]) {
    // if value is undefined or null, clear
    if (!v) {
      this.$select.trigger('clear');
      return;
    }
    let r: any = null;

    if (this.multiple) {
      const values = Array.isArray(v) ? v : [v];
      r = values.map((d: any) => ({id: d.value || d.id, text: d.name || d.text}));
      const old = <ISelect2Option[]>this.value;
      if (sameValues(old, r)) {
        return;
      }
    } else {
      const vi: any = Array.isArray(v) ? v[0] : v;
      r = {id: vi, text: vi};

      if ((vi.name || vi.text) && (vi.value || vi.id)) {
        r.id = vi.value || vi.id;
        r.text = vi.name || vi.text;
      }

      const old = <ISelect2Option>this.value;
      if (old.id === r.id) { // no change
        return;
      }
    }

    this.$select.val(r).trigger('change');
  }

}

/**
 * compare array independent of the order
 * @param a
 * @param b
 * @returns {boolean}
 */
function sameValues(a: ISelect2Option[], b: ISelect2Option[]) {
  if (a.length !== b.length) {
    return false;
  }
  const aids = new Set(a.map((d) => d.id));
  const bids = new Set(b.map((d) => d.id));
  if (aids.size !== bids.size) {
    return false;
  }
  // all of a contained in b
  return Array.from(aids.values()).every((d) => bids.has(d));
}
