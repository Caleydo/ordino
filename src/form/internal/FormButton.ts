import {FormElementType, IFormElement, IFormElementDesc, IFormParent} from '../interfaces';
import * as d3 from 'd3';
import {EventHandler} from 'phovea_core/src/event';

export interface IButtonElementDesc extends IFormElementDesc {
  iconClasses: string;
  onClick: () => void;
}

export default class FormButton extends EventHandler implements IFormElement {
  private $button: d3.Selection<HTMLButtonElement>;
  private $node;
  private clicked: boolean = false;

  readonly type: FormElementType.BUTTON;
  readonly id: string;

  constructor(readonly parent: IFormParent, readonly $parent, readonly desc: IButtonElementDesc) {
    super();
    this.id = desc.id;
    this.$node = $parent.append('div').classed('form-group', true);
    this.build();
  }

  /**
   * Set the visibility of an form element - needed by IFormElement
   * @param visible
   */
  setVisible(visible: boolean) {
    this.$node.classed('hidden', !visible);
  }

  get value() {
    return this.clicked;
  }

  set value(clicked) {
    this.clicked = clicked;
  }

  build() {
    this.$button = this.$node.append('button').classed(this.desc.attributes.clazz, true);
    this.$button.html(() => this.desc.iconClasses? `<i class="${this.desc.iconClasses}"></i> ${this.desc.label}` : this.desc.label);
    this.$button.on('click', () => {
      this.value = true;
      this.desc.onClick();
    });
  }
}
