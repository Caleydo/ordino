/**
 * Created by Samuel Gratzl on 08.03.2017.
 */


import {IEventHandler} from 'phovea_core/src/event';

/**
 * List of all available for elements that the form builder can handle
 * @see FormBuilder.appendElement()
 */
export enum FormElementType {
  SELECT,
  SELECT2,
  INPUT_TEXT,
  MAP,
  BUTTON
}

/**
 * The description is used to build the form element
 */
export interface IFormElementDesc {
  /**
   * Choose a type which element should be created
   */
    type: FormElementType;

  /**
   * Unique identifier for each page
   */
  id: string;

  /**
   * Label for the form element
   */
  label?: string;

  /**
   * Show or hide form element
   */
  visible?: boolean;

  /**
   * Attributes that are applied to the DOM element
   */
  attributes?: {
    /**
     * Note: Used `clazz` instead of the DOM property `class`, due to JS reserved keyword
     */
    clazz?: string,
    /**
     * Id attribute can be set independently from the `id` property above or will be copied if empty
     */
    id?: string,
    /**
     * Style attribute
     */
    style?: string
  };

  /**
   * Id of a different form element where an on change listener is attached to
   */
  dependsOn?: string[];

  /**
   *
   */
  showIf?: (dependantValue: any[]) => boolean;

  /**
   * Whether to store the value in a session or not
   */
  useSession?: boolean;

  /**
   * Form element specific options
   */
  options?: {};

  /**
   * hide label
   */
  hideLabel?: boolean;
}



export interface IFormParent {
  getElementById(id: string): IFormElement;
}

/**
 * Describes public properties of a form element instance
 */
export interface IFormElement extends IEventHandler {
  /**
   * Unique identifier of the element within the form
   */
  readonly id: string;

  /**
   * Form element value
   */
  value?: any;

  /**
   * Set the visibility of an form element
   * @param visible
   */
  setVisible(visible: boolean): void;
}
