/**
 * Created by Samuel Gratzl on 08.03.2017.
 */

import {} from 'd3';
import AFormElement from './AFormElement';
import {IFormElementDesc, IFormParent} from '../interfaces';


/**
 * Add specific options for input form elements
 */
export interface IFormMapDesc extends IFormElementDesc {
  /**
   * Additional options
   */
  options?: {
    keys?: (string|{value: string, name: string})[];
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

  private createValueEditor(value: string) {
    return `<input type="text" class="form-control">`;
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
            ${options.map((o) => `<option value="${o.value}" ${o.value === d.key ? 'selected="selected"': ''}>${o.name}</option>`).join('')}
          </select>
        </div>
        <div class="col-sm-7">${d.key ? this.createValueEditor(d.key) : ''}</div>`;
      row.querySelector('select').addEventListener('change', function (this: HTMLSelectElement) {
        if (!this.value) {
          // remove this row
          row.remove();
          return;
        }
        if (d.key !== this.value) { // value changed
          if (d.key) { //has an old value?
            row.lastElementChild.remove();
          }
          row.insertAdjacentHTML('beforeend', `<div class="col-sm-7">${that.createValueEditor(this.value)}</div>`);
          row.lastElementChild.addEventListener('change', function (this: HTMLSelectElement|HTMLInputElement) {
            d.value = this.value;
          });

          if (!d.key) {
            // ensure that there is an empty row
            renderRow({key: '', value: null});
          }
        }
        d.key = this.value;
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
