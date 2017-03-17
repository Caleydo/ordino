/**
 * Created by Samuel Gratzl on 08.03.2017.
 */

import 'select2';
import {} from 'd3';
import * as $ from 'jquery';
import AFormElement from './AFormElement';
import {IFormElementDesc, IFormParent, FormElementType} from '../interfaces';
import {IFormSelectOption} from './FormSelect';
import {DEFAULT_OPTIONS} from './FormSelect2';
import {mixin} from 'phovea_core/src';

export interface ISubDesc {
  name: string;
  value: string;
}
export interface ISubInputDesc extends ISubDesc {
  type: FormElementType.INPUT_TEXT;
}

declare type ISelectOptions = ((string|IFormSelectOption)[]|Promise<(string|IFormSelectOption)[]>);

export interface ISubSelectDesc extends ISubDesc {
  type: FormElementType.SELECT;
  /**
   * teh data, a promise of the data or a function computing the data or promise
   */
  optionsData: ISelectOptions|(() => ISelectOptions);
}
export interface ISubSelect2Desc extends ISubDesc {
  type: FormElementType.SELECT2;
  optionsData?: ISelectOptions|(() => ISelectOptions);
  return?: 'text'|'id';
  dataProviderUrl?: string;
}

/**
 * Add specific options for input form elements
 */
export interface IFormMapDesc extends IFormElementDesc {
  /**
   * Additional options
   */
  options?: {
    inline?: boolean;
    entries: (ISubInputDesc|ISubSelectDesc|ISubSelect2Desc)[];
  };
}

interface IFormRow {
  key: string;
  value: any;
}

export default class FormMap extends AFormElement<IFormMapDesc> {

  private $group: d3.Selection<any>;
  private rows: IFormRow[] = [];

  /**
   * Constructor
   * @param parent
   * @param $parent
   * @param desc
   */
  constructor(parent: IFormParent, $parent, desc: IFormMapDesc) {
    super(parent, desc);

    this.$node = $parent.append('div').classed('form-group', true);

    this.build();
  }

  /**
   * Build the label and input element
   * Bind the change listener and propagate the selection by firing a change event
   */
  protected build() {
    super.build();
    this.$group = this.$node.append('div');
    this.setAttributes(this.$group, this.desc.attributes);
    // adapt default settings
    this.$group.classed('form-horizontal', true).classed('form-control', false).classed('form-group-sm', true);
    this.handleShowIf();

    this.buildMap();

    // propagate change action with the data of the selected option
    this.$group.on('change.propagate', () => {
      this.fire('change', this.value, this.$group);
    });
  }

  private addValueEditor(row: IFormRow, parent: Element) {
    const that = this;
    const desc = this.desc.options.entries.find((d) => d.value === row.key);

    function mapOptions(d: IFormSelectOption|string) {
      const value = typeof d === 'string' ? d : d.value;
      const name = typeof d === 'string' ? d : d.name;
      return `<option value="${value}">${name}</option>`;
    }

    const initialValue = row.value;

    switch (desc.type) {
      case FormElementType.SELECT:
        parent.insertAdjacentHTML('afterbegin', `<select class="form-control"></select>`);
        // register on change listener
        parent.firstElementChild.addEventListener('change', function (this: HTMLSelectElement) {
          row.value = this.value;
          that.fire('change', that.value, that.$group);
        });
        Promise.resolve(typeof desc.optionsData === 'function' ? desc.optionsData() : desc.optionsData).then((values) => {
          parent.firstElementChild.innerHTML = values.map(mapOptions).join('');
          if (initialValue) {
            (<HTMLSelectElement>parent.firstElementChild).selectedIndex = values.map((d) => typeof d === 'string' ? d : d.value).indexOf(initialValue);
          } else {
            const first = values[0];
            row.value = typeof first === 'string' ? first : first.value;
          }
        });
        break;
      case FormElementType.SELECT2:
        parent.insertAdjacentHTML('afterbegin', `<select class="form-control"></select>`);
        if (!desc.optionsData) {
          desc.optionsData = [];
        }
        Promise.resolve(typeof desc.optionsData === 'function' ? desc.optionsData() : desc.optionsData).then((values) => {
          parent.firstElementChild.innerHTML = values.map(mapOptions).join('');
          const s = parent.firstElementChild;
          const $s = (<any>$(s)).select2(mixin({
            defaultData: initialValue ? [initialValue] : []
          }, DEFAULT_OPTIONS, desc));
          if (values.length > 0 && !initialValue) {
            const first = values[0];
            row.value = typeof first === 'string' ? first : first.value;
          }
          // register on change listener use full select2 items
          $s.on('change', function (this: HTMLSelectElement) {
            const r = {id: '', text: ''}; // default value
            if ($s.val() !== null) {
              r.id = $s.select2('data')[0].id;
              r.text = $s.select2('data')[0].text;
            }
            if (desc.return === 'id') {
              row.value = r.id;
            } else if (desc.return === 'text') {
              row.value = r.text;
            } else {
              row.value = r;
            }
            that.fire('change', that.value, that.$group);
          });
        });
        break;
      default:
        parent.insertAdjacentHTML('afterbegin', `<input type="text" class="form-control" value="${initialValue || ''}">`);
        parent.firstElementChild.addEventListener('change', function (this: HTMLInputElement) {
          row.value = this.value;
          that.fire('change', that.value, that.$group);
        });
    }
  }

  private buildMap() {
    const that = this;
    const group = <HTMLDivElement>this.$group.node();
    group.innerHTML = ''; // remove all approach
    const values = this.rows.filter((d) => !!d.key);
    // put empty row at the end
    values.push({key: '', value: null});
    this.rows = [];

    const renderRow = (d: IFormRow) => {
      this.rows.push(d);
      const row = group.ownerDocument.createElement('div');
      row.classList.add('form-group');
      group.appendChild(row);
      row.innerHTML = `
        <div class="col-sm-5">
          <select class="form-control">
            <option value="">Select...</option>
            ${this.desc.options.entries.map((o) => `<option value="${o.value}" ${o.value === d.key ? 'selected="selected"' : ''}>${o.name}</option>`).join('')}
          </select>
        </div>
        <div class="col-sm-7"></div>`;

      if (d.key) { // has value
        this.addValueEditor(d, row.lastElementChild);
      }
      row.querySelector('select').addEventListener('change', function (this: HTMLSelectElement) {
        if (!this.value) {
          // remove this row
          row.remove();
          that.rows.splice(that.rows.indexOf(d), 1);
          that.fire('change', that.value, that.$group);
          return;
        }
        if (d.key !== this.value) { // value changed
          if (d.key) { //has an old value?
            row.lastElementChild.innerHTML = '';
          } else {
            // ensure that there is an empty row
            renderRow({key: '', value: null});
          }
          d.key = this.value;
          that.addValueEditor(d, row.lastElementChild);
        }
      });
    };
    values.forEach(renderRow);
  }

  /**
   * Returns the value
   * @returns {string}
   */
  get value() {
    // just rows with a valid key and value
    return this.rows.filter((d) => d.key && d.value);
  }

  /**
   * Sets the value
   * @param v
   */
  set value(v: IFormRow[]) {
    this.rows = v;
    this.buildMap();
  }

}

export function convertRow2MultiMap(rows: IFormRow[]) {
  if (!rows) {
    return {};
  }
  const map = new Map<string, any[]>();
  rows.forEach((row) => {
    if (!map.has(row.key)) {
      map.set(row.key, [row.value]);
    } else {
      map.get(row.key).push(row.value);
    }
  });
  const r: {[key: string]: any|any[]} = {};
  map.forEach((v, k) => {
    if (v.length === 1) {
      r[k] = v[0];
    } else {
      r[k] = v;
    }
  });
  return r;
}
