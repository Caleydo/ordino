/**
 * Created by Samuel Gratzl on 08.03.2017.
 */

import 'select2';
import * as d3 from 'd3';
import {randomId} from 'phovea_core/src/index';
import {IFormElement, IFormElementDesc} from './interfaces';
import {create} from './internal';

/**
 * Builds a form from a given collection of form elements
 */
export default class FormBuilder {

  /**
   * DOM node for the form itself
   */
  private $node: d3.Selection<any>;

  /**
   * Map of all appended form elements with the element id as key
   * @type {d3.Map<IFormElement>}
   */
  private readonly elements = new Map<string, IFormElement>();

  /**
   * Constructor
   * @param $parent Node that the form should be attached to
   * @param formId unique identifier for this form
   */
  constructor($parent: d3.Selection<any>, private readonly formId = randomId()) {
    this.$node = $parent.append('form').attr('id', this.formId);
  }

  /**
   * Builds a form from a list of given form element descriptions
   * @param elements
   */
  build(elements: IFormElementDesc[]) {
    elements.forEach((el) => {
      this.appendElement(el);
    });
  }

  /**
   * Creates a form element instance from a form element description and
   * appends it to the form
   * @param elementDesc
   */
  appendElement(elementDesc: IFormElementDesc) {
    // inject formId into form element id
    const uid = elementDesc.id + '_' + this.formId;

    elementDesc.attributes = elementDesc.attributes || {};
    elementDesc.attributes.id = uid; // add id as attribute
    elementDesc.attributes.clazz = elementDesc.attributes.clazz || '';
    elementDesc.attributes.clazz += ' form-control';

    this.elements.set(elementDesc.id, create(this, this.$node, elementDesc));
  }

  /**
   * Returns the form element instance, if exists. Otherwise returns `null`.
   * @param id
   * @returns {IFormElement}
   */
  getElementById(id: string) {
    return this.elements.get(id);
  }

  /**
   * Returns an object with the form element id as key and the current data as value
   * @returns {{}}
   */
  getElementData(): { [key: string]: any } {
    const r: { [key: string]: any } = {};
    this.elements.forEach((el, key) => {
      const value = el.value;
      r[key] = (value !== null && value.data !== undefined) ? value.data : value;
    });
    return r;
  }

  /**
   * Returns an object with the form element id as key and the current form element value
   * @returns {{}}
   */
  getElementValues(): { [key: string]: any } {
    const r: { [key: string]: any } = {};
    this.elements.forEach((el, key) => {
      const value = el.value;
      r[key] = (value && value.value) ? value.value : value;
    });
    return r;
  }

  /**
   * validates the current form
   * @returns {boolean} if valid
   */
  validate() {
    return Array.from(this.elements.values())
      .map((d) => d.validate()) // perform validation on each element (returns array of boolean values)
      .every((d) => d); // return true if every validation was truthy
  }
}
