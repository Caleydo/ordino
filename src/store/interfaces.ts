import { IColumnDesc } from 'lineupjs';
import { IRow, IViewPluginDesc } from 'tdp_core';

export enum EViewDirections {
  N = 'n',
  S = 's',
  W = 'w',
  E = 'e',
}

export interface IWorkbenchView {
  // this id is used to load the view from the view plugin. It is not unique.
  id: string;
  // this id is generated on creation and is simply a unique value used to differentiate views that may have the same id.
  uniqueId: string;
  name: string;
  filters: string[];
  parameters?: any;
}

export interface IOrdinoAppUntrackedState {
  /**
   * Stores the available global query name used in the current session
   */
  globalQueryName?: string;

  /**
   * Stores the available global query categories available for the current session
   */
  globalQueryCategories?: (number | string)[];

  /**
   * Filter query that is applied to all entities.
   * analog to IQueryFilter
   */
  appliedQueryCategories?: (number | string)[];
}

export interface IOrdinoAppTrackedState {
  /**
   * List of open views.
   */
  workbenches: IWorkbench[];

  /**
   * Id of the current focus view
   */
  focusWorkbenchIndex: number;

  /**
   * Map for the colors which are assigned to each entity. Derived from the config file.
   * Keys are the entity id matching IWorkbench.entityId.
   * Values are any typical string representation of a color.
   */
  colorMap: { [key: string]: string };

  midTransition: boolean;

  /**
   * isAnimating is true when transitioning between workbenches, during the animation.
   */
  isAnimating: boolean;
}

export enum EWorkbenchDirection {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

/**
 * entityId is equivalent to IWorkbench.entityId
 * columnSelection is a mapping subtype, such as "relativecopynumber"
 */
export interface ISelectedMapping {
  entityId: string;
  columnSelection: string;
}

export interface IWorkbench {
  /**
   * List of open views. The order of the views in this list determines the order they are displayed in the workbench.
   */
  views: IWorkbenchView[];

  /**
   * List of selected mappings which are passed to the next workbench when created. Description of ISelectedMapping interface above.
   */
  selectedMappings: ISelectedMapping[];

  viewDirection: EWorkbenchDirection;

  name: string;
  /**
   * itemIDType of the views in a workbench, should match the itemIDType of the default ranking
   */
  itemIDType: string;
  entityId: string;

  index: number;

  data: { [key: string]: IRow };
  columnDescs: (IColumnDesc & { [key: string]: any })[];
  // TODO: how do we store the lineup-specific column descriptions? give an example?

  /**
   * List selected rows
   */
  selection: IRow['id'][];

  /**
   * Formatting properties of an entity. This includes an id column used for automatically parsing ids in form dialogs
   * (e.g., select3). Also, formatting serves as a central place where the default format of an entity is defined.
   * TODO: will be replaced by a general interface after Ollie's refactoring PR (https://github.com/Caleydo/ordino/pull/368)
   * See field descriptions in https://github.com/datavisyn/reprovisyn/blob/58bc3f2fecf1632571cea7f6606412f7b11b4fd3/src/base/types.ts#L81
   */
  formatting?: {
    titleColumn?: string;
    idColumn: string;
    template?: string;
    /**
     * For select3 forms, this token separator is used for parsing multiple id's pasted into the form dialog
     */
    tokenSeparatorsRegex?: string;
    defaultTokenSeparator?: string;
  };

  /**
   * "detailsSidebar" is the information about the incoming selection of a workbench. It is a panel on the left side of a workbench, openable via burger menu.
   * Since the first workbench does not have an incoming selection, this is always false for the first workbench
   * detailsSidebarOpen keeps track of whether or not the details tab is switched open.
   */
  detailsSidebarOpen: boolean;

  commentsOpen?: boolean;
}

interface IBaseState {
  selection: string[];
}

export interface IOrdinoViewPlugin<S extends IBaseState> extends IViewPluginDesc {
  state: S;
}
