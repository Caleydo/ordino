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
   * Static constant for creating a view command
   * Note: the string value is referenced for the `actionFactory` and `actionCompressor` in the package.json,
   *       i.e. be careful when refactor the value
   * @type {string}
   */
  static readonly CMD_CREATE_VIEW = 'targidCreateView';

  /**
   * Static constant for removing a view command
   * Note: the string value is referenced for the `actionFactory` and `actionCompressor` in the package.json,
   *       i.e. be careful when refactor the value
   * @type {string}
   */
  static readonly CMD_REMOVE_VIEW = 'targidRemoveView';

  /**
   * Static constant for replacing a view command
   * Note: the string value is referenced for the `actionFactory` and `actionCompressor` in the package.json,
   *       i.e. be careful when refactor the value
   * @type {string}
   */
  static readonly CMD_REPLACE_VIEW = 'targidReplaceView';

  static readonly CMD_INIT_SESSION = 'targidInitSession';

  /**
   * Static constant as identification for Targid views
   * Note: the string value is referenced for multiple view definitions in the package.json,
   *       i.e. be careful when refactor the value
   */
  static readonly VIEW = 'targidView';

  /**
   * Static constant for setting a parameter of a view
   * Note: the string value is referenced for the `actionFactory` in the package.json,
   *       i.e. be careful when refactor the value
   * @type {string}
   */
  static readonly CMD_SET_PARAMETER = 'targidSetParameter';

  /**
   * Static constant for setting a selection of a view
   * Note: the string value is referenced for the `actionFactory` in the package.json,
   *       i.e. be careful when refactor the value
   * @type {string}
   */
  static readonly CMD_SET_SELECTION = 'targidSetSelection';

  /**
   * Static constant to store details about a new entry point in the session
   * @type {string}
   */
  static readonly NEW_ENTRY_POINT = 'targidNewEntryPoint';


  //filter to disable certain views
  static readonly EXTENSION_POINT_DISABLE_VIEW = 'disableTargidView';

  // filter extensions
  static readonly FILTERS_EXTENSION_POINT_ID = 'ordinoListFilters';

}


/**
 * number of temporary workspaces to keep
 * @type {number}
 */
export const KEEP_ONLY_LAST_X_TEMPORARY_WORKSPACES = 5;
