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

export interface ISubInputDesc {
  type: FormElementType.INPUT_TEXT;
}
export interface ISubSelectDesc {
  type: FormElementType.SELECT;
  optionsData: (string|IFormSelectOption)[];
}
export interface ISubSelect2Desc {
  type: FormElementType.SELECT2;
  optionsData?: (string|IFormSelectOption)[];
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
    keys?: (string|{value: string, name: string})[];
    values?: {
      [key: string]: ISubInputDesc|ISubSelectDesc|ISubSelect2Desc;
    }
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
    this.$group.classed('form-horizontal', true).classed('form-control', false);
    this.handleShowIf();

    this.buildMap();

    // propagate change action with the data of the selected option
    this.$group.on('change.propagate', () => {
      this.fire('change', this.value, this.$group);
    });
  }

  private addValueEditor(row: IFormRow, parent: Element) {
    const that = this;
    let desc = this.desc.options ? this.desc.options.values[row.key] : null;
    if (!desc) {
      desc = {type: FormElementType.INPUT_TEXT};
    }
    function mapOptions(d: IFormSelectOption) {
      const value = typeof d === 'string' ? d : d.value;
      const name = typeof d === 'string' ? d : d.name;
      return `<option value="${value}">${name}</option>`;
    }
    const initialValue = row.value;

    switch (desc.type) {
      case FormElementType.SELECT:
        parent.insertAdjacentHTML('afterbegin', `<select class="form-control">${desc.optionsData.map(mapOptions).join('')}</select>`);
        // register on change listener
        parent.firstElementChild.addEventListener('change', function (this: HTMLSelectElement) {
          row.value = this.value;
          that.fire('change', that.value, that.$group);
        });
        if (initialValue) {
          (<HTMLSelectElement>parent.firstElementChild).selectedIndex = desc.optionsData.map((d) => typeof d === 'string' ? d : d.value).indexOf(initialValue);
        }
        break;
      case FormElementType.SELECT2:
        const options = desc.optionsData ? desc.optionsData.map(mapOptions) : [];
        parent.insertAdjacentHTML('afterbegin', `<select class="form-control">${options.join('')}</select>`);
        const s = parent.firstElementChild;
        const $s = (<any>$(s)).select2(mixin({
          defaultData: initialValue ? [initialValue] : []
        }, DEFAULT_OPTIONS, desc));
        // register on change listener use full select2 items
        $s.on('change', function (this: HTMLSelectElement) {
          row.value = {id: '', text: ''}; // default value
          if ($s.val() !== null) {
            row.value.id = $s.select2('data')[0].id;
            row.value.text = $s.select2('data')[0].text;
          }
          that.fire('change', that.value, that.$group);
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

    const options = (this.desc.options.keys || []).map((d) => {
      const value = typeof d === 'string' ? d : d.value;
      const name = typeof d === 'string' ? d : d.name;
      return {name, value};
    });

    const renderRow = (d: IFormRow) => {
      this.rows.push(d);
      const row = group.ownerDocument.createElement('div');
      row.classList.add('form-group');
      group.appendChild(row);
      row.innerHTML = `
        <div class="col-sm-5">
          <select class="form-control">
            <option value="">Select...</option>
            ${options.map((o) => `<option value="${o.value}" ${o.value === d.key ? 'selected="selected"' : ''}>${o.name}</option>`).join('')}
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
    // filter all rows that don't have a key
    return this.rows.filter((d) => !!d.key);
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
