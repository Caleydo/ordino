/**
 * Created by Samuel Gratzl on 08.03.2017.
 */

import * as d3 from 'd3';
import {EventHandler} from 'phovea_core/src/event';
import {IFormElementDesc, IFormParent, IFormElement} from '../interfaces';

/**
 * Abstract form element class that is used as parent class for other form elements
 */
export abstract class AFormElement extends EventHandler implements IFormElement {

  id: string;

  protected $node: d3.Selection<any>;

  /**
   * Constructor
   * @param formBuilder
   * @param $parent
   * @param desc
   */
  constructor(public readonly formBuilder: IFormParent, $parent: d3.Selection<any>, protected readonly desc: IFormElementDesc) {
    super();
    this.id = desc.id;
  }

  /**
   * Set the visibility of an form element
   * @param visible
   */
  setVisible(visible: boolean) {
    this.$node.classed('hidden', !visible);
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
  }

  protected handleShowIf() {
    if (!this.desc.dependsOn || !this.desc.showIf) {
      return;
    }

    const dependElements = this.desc.dependsOn.map((depOn) => this.formBuilder.getElementById(depOn));

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
  get value() {
    // hook
    return 'Override AFormElement.value';
  }

  /**
   * Set the form element value
   * @param v
   */
  set value(v: string) {
    // hook
  }
}

export default AFormElement;
