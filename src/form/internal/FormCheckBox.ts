import {IFormElementDesc, IFormParent} from '../interfaces';
import * as d3 from 'd3';
import {AFormElement} from './AFormElement';
import * as session from 'phovea_core/src/session';

export interface ICheckBoxElementDesc extends IFormElementDesc {
  checked?: any;
  unchecked?: any;
}

export default class FormCheckBox extends AFormElement<ICheckBoxElementDesc> {

  private $input: d3.Selection<any>;

  /**
   * Constructor
   * @param parent
   * @param $parent
   * @param desc
   */
  constructor(parent: IFormParent, $parent, desc: ICheckBoxElementDesc) {
    super(parent, Object.assign({ checked: true, unchecked: false}, desc));

    this.$node = $parent.append('div').classed('checkbox', true);

    this.build();
  }

  /**
   * Build the label and input element
   * Bind the change listener and propagate the selection by firing a change event
   */
  protected build() {
    super.build();
    this.$input = this.$node.append('input').attr('type', 'checkbox');
    this.setAttributes(this.$input, this.desc.attributes);

    if (this.desc.useSession) {
      this.$input.property('checked', session.retrieve(this.id + '_value', this.desc.unchecked) === this.desc.checked);
    } else {
      this.$input.property('checked', false);
    }

    this.handleShowIf();

    // propagate change action with the data of the selected option
    this.$input.on('change.propagate', () => {
      if (this.desc.useSession) {
        session.store(this.id+'_value', this.value);
      }
      this.fire('change', this.value, this.$input);
    });
  }

  /**
   * Returns the value
   * @returns {string}
   */
  get value() {
    return this.$input.property('checked') ? this.desc.checked: this.desc.unchecked;
  }

  /**
   * Sets the value
   * @param v
   */
  set value(v: any) {
    this.$input.property('value', v === this.desc.checked);
  }
}
