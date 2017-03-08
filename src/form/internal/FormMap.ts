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
    this.$group = this.$node.append('div').attr('class', 'form-horizontal');
    this.setAttributes(this.$group, this.desc.attributes);
    this.$group.classed('form-horizontal', true);
    this.handleShowIf();

    this.buildMap([]);

    // propagate change action with the data of the selected option
    this.$group.on('change.propagate', () => {
      this.fire('change', this.value, this.$group);
    });
  }

  private createValueEditor(value: string) {
    return `<input type="text" class="form-control">`;
  }

  private buildMap(values: IFormRow[]) {
    values = values.filter((d) => !!d.key);
    // put empty row at the end
    values.push({key: '', value: null});

    const options = (this.desc.options.keys || []).map((d) => {
      const value = typeof d === 'string' ? d : d.value;
      const name = typeof d === 'string' ? d : d.name;
      return {name, value};
    });
    const optionValues = options.map((d) => d.value);

    const $formGroups = this.$group.selectAll('.form-group').data(values);
    const $formsGroupsEnter = $formGroups.enter().append('div')
      .classed('form-group', true)
      .html((d, i) => `
        <div class="col-sm-5">
          <select id="${this.desc.id}_key${i}" class="form-control">
            <option value="">Select...</option>
            ${options.map((d) => `<option value="${d.value}">${d.name}</option>`).join('')}
          </select>
        </div>
      `);
    const that = this;
    $formsGroupsEnter.select('select').on('change', function (this: HTMLSelectElement, d) {
      const parent = this.parentElement;
      if (!this.value) {
        // remove this row
        parent.remove();
        return;
      }
      if (d.key !== this.value) { // value changed
        if (d.key) { //has an old value?
          parent.lastElementChild.remove();
        }
        parent.insertAdjacentHTML('beforeend', `<div class="col-sm-7">${that.createValueEditor(this.value)}</div>`);
        parent.lastElementChild.addEventListener('change', function (this: HTMLSelectElement|HTMLInputElement) {
          d.value = this.value;
        });
      }
      d.key = this.value;
    });
    // + 1 the empty entry
    $formGroups.select('select').property('selectedIndex', (d) => optionValues.indexOf(d.key) + 1);
    // TODO
    $formGroups.exit().remove();
  }

  /**
   * Returns the value
   * @returns {string}
   */
  get value() {
    // filter all rows that don't have a key
    return this.$group.selectAll<IFormRow>('.form-group').data().filter((d) => !!d.key);
  }

  /**
   * Sets the value
   * @param v
   */
  set value(v: IFormRow[]) {
    this.buildMap(v);
  }

}
