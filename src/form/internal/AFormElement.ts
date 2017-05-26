/**
 * Created by Samuel Gratzl on 08.03.2017.
 */

import * as d3 from 'd3';
import {EventHandler} from 'phovea_core/src/event';
import {IFormElementDesc, IFormParent, IFormElement} from '../interfaces';

/**
 * Abstract form element class that is used as parent class for other form elements
 */
export abstract class AFormElement<T extends IFormElementDesc> extends EventHandler implements IFormElement {

  readonly id: string;

  protected $node: d3.Selection<any>;

  /**
   * Constructor
   * @param parent
   * @param desc
   */
  constructor(protected readonly parent: IFormParent, protected readonly desc: T) {
    super();
    this.id = desc.id;
  }

  isRequired() {
    return this.desc.required;
  }

  validate() {
    if (!this.isVisible() || !this.isRequired()) {
      return true;
    }
    return  this.hasValue();
  }

  protected hasValue() {
    return !!this.value;
  }


  isVisible() {
    return this.$node.classed('hidden');
  }

  /**
   * Set the visibility of an form element
   * @param visible
   */
  setVisible(visible: boolean) {
    this.$node.classed('hidden', !visible);
  }

  protected build() {
    if (this.desc.visible === false) {
      this.$node.classed('hidden', true);
    }

    if (!this.desc.hideLabel) {
      this.$node.append('label').attr('for', this.desc.attributes.id).text(this.desc.label);
    }
  }

  /**
   * Set a list of object properties and values to a given node
   * Note: Use `clazz` instead of the attribute `class` (which is a reserved keyword in JavaScript)
   * @param $node
   * @param attributes Plain JS object with key as attribute name and the value as attribute value
   */
  protected setAttributes($node: d3.Selection<any>, attributes: {[key: string]: any}) {
    if (!attributes) {
      return;
    }

    Object.keys(attributes).forEach((key) => {
      $node.attr((key === 'clazz') ? 'class' : key, attributes[key]);
    });

    if (this.desc.required) {
      $node.attr('required', 'required');
    }
  }

  protected handleShowIf() {
    if (!this.desc.dependsOn || !this.desc.showIf) {
      return;
    }

    const dependElements = this.desc.dependsOn.map((depOn) => this.parent.getElementById(depOn));

    dependElements.forEach((depElem) => {
      depElem.on('change', (evt, value) => {
        const values = dependElements.map((d) => d.value);
        return this.$node.classed('hidden', !this.desc.showIf(values));
      });
    });

    const values = dependElements.map((d) => d.value);
    this.$node.classed('hidden', !this.desc.showIf(values));
  }

  /**
   * Returns the form element value
   * @returns {string}
   */
  abstract get value();

  /**
   * Set the form element value
   * @param v
   */
  abstract set value(v: any);
}

export default AFormElement;
