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
   * Unique id for every form and all the form elements
   * @type {string}
   */
  private readonly formId = randomId();

  /**
   * Map of all appended form elements with the element id as key
   * @type {d3.Map<IFormElement>}
   */
  private readonly elements = new Map<string, IFormElement>();

  /**
   * Constructor
   * @param $parent Node that the form should be attached to
   */
  constructor($parent: d3.Selection<any>) {
    this.$node = $parent.append('form');
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
  getElementData(): {[key: string]: any} {
    const r: {[key: string]: any} = {};
    this.elements.forEach((el, key) => {
      r[key] = (el.value !== null && el.value.data !== undefined) ? el.value.data : el.value;
    });
    return r;
  }

  /**
   * Returns an object with the form element id as key and the current form element value
   * @returns {{}}
   */
  getElementValues(): {[key: string]: any} {
    const r: {[key: string]: any} = {};
    this.elements.forEach((el, key) => {
      r[key] = el.value.value || el.value;
    });
    return r;
  }

}
