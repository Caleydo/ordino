/**
 * Created by sam on 03.03.2017.
 */


export default class TargidConstants {
  /**
   * Name of the application
   * Note: the string value is referenced in the package.json, i.e. be careful when refactor the value
   * @type {string}
   */
  static readonly APP_NAME = 'Targid';

  /**
   * Static constant to store details about a new entry point in the session
   * @type {string}
   */
  static readonly NEW_ENTRY_POINT = 'targidNewEntryPoint';
}
