import { IColumnDesc } from 'lineupjs';
import {
  DefineVisynViewPlugin,
  IDTypeManager,
  IScoreRow,
  IServerColumn,
  isVisynViewPluginDesc,
  ViewUtils,
  VisynDataViewPluginType,
  VisynSimpleViewPluginType,
} from 'tdp_core';
import { IOrdinoRelation } from '../base';
import { ISelectedMapping, IWorkbench } from '../store';

export interface IOrdinoVisynViewDesc {
  /**
   * Name of the view.
   * Used as label for the view chooser and as title of the the workbench window.
   */
  name: string;

  /**
   * Description of the view
   */
  description?: string;

  /**
   * Make the view the default view of a workbench.
   * Should only be applied to a single view.
   */
  defaultView?: boolean;

  /**
   * Font Awesome icon (e.g., `far fa-table`).
   * Optional icon for each visyn view in Ordino.
   * @default "far fa-window-maximize"
   */
  icon?: string;
}

/**
 * Extend `VisynSimpleViewPluginType` with `IOrdinoVisynViewDesc`
 * to enable type checking and auto-complete for the plugin desc
 * when registering the views.
 */
export type OrdinoSimpleViewPluginType<
  Param extends Record<string, unknown> = Record<string, unknown>,
  Desc extends Record<string, unknown> = Record<string, unknown>,
> = VisynSimpleViewPluginType<Param, Desc & IOrdinoVisynViewDesc>;

/**
 * Extend `OrdinoDataViewPluginType` with `IOrdinoVisynViewDesc`
 * to enable type checking and auto-complete for the plugin desc
 * when registering the views.
 */
export type OrdinoDataViewPluginType<
  Param extends Record<string, unknown> = Record<string, unknown>,
  Desc extends Record<string, unknown> = Record<string, unknown>,
> = VisynDataViewPluginType<Param, Desc & IOrdinoVisynViewDesc>;

/**
 * Plugin desc for the Ordino ranking view
 */
export interface IOrdinoRankingViewDesc extends IOrdinoVisynViewDesc {
  /**
   * Relation for the Ordino view
   */
  relation: IOrdinoRelation;
}

export interface IOrdinoRankingViewParam {
  prevSelection: string[];
  selectedMappings: ISelectedMapping[];
  globalQueryName: string;
  appliedQueryCategories: string[];
}

export type OrdinoRankingViewPluginType<
  Param extends Record<string, unknown> = Record<string, unknown>,
  Desc extends Record<string, unknown> = Record<string, unknown>,
> = DefineVisynViewPlugin<
  'ranking',
  Param & IOrdinoRankingViewParam,
  {
    /**
     * Data array matching the columns defined in the `columnDesc`.
     */
    data: Record<string, unknown>[];
    /**
     * Data column description describing the given `data`.
     * TODO:: Type to IReprovisynServerColumn when we merge that into tdp_core
     */
    columnDesc: IServerColumn[] | any[];

    /**
     * List of items which are filtered out of the view. Ids match the idtype from 'desc.idtype'
     */
    filteredOutIds: string[];

    /**
     * Callback when the Filter changed.
     * @param filteredOutIds New Filter.
     */
    onFilteredOutIdsChanged(filteredOutIds: React.SetStateAction<string[]>): void;

    /**
     * Callback when the Column Description changed.
     * @param desc New Column Description.
     */
    onColumnDescChanged(desc: IColumnDesc): void;
    /**
     * Callback when the Data changed.
     * @param data New Data.
     */
    onDataChanged(data: any[]): void;
    /**
     * Callback when a score column is added.
     * @param desc desc of new column.
     * @param data data of new column.
     */
    onAddScoreColumn(
      desc: IColumnDesc & {
        [key: string]: any;
      },
      data: IScoreRow<any>[],
    ): void;
    /**
     * add formatting information to the workbench: when showing an entity's selected item we might want to display
     * a string from a column other than the selection id.
     * @param formatting TODO add typings once Ollie's interface refactoring is finished
     */
    onAddFormatting(formatting: IWorkbench['formatting']): void;
  },
  Desc & IOrdinoRankingViewDesc
>;

export type OrdinoRankingViewPluginDesc = OrdinoRankingViewPluginType['desc'];
export type OrdinoRankingViewPlugin = OrdinoRankingViewPluginType['plugin'];

export function isVisynRankingViewDesc(desc: unknown): desc is OrdinoRankingViewPluginDesc {
  return isVisynViewPluginDesc(desc) && (<any>desc)?.visynViewType === 'ranking';
}

export function isVisynRankingView(plugin: unknown): plugin is OrdinoRankingViewPlugin {
  return isVisynViewPluginDesc((<any>plugin)?.desc) && (<any>plugin)?.viewType === 'ranking';
}

/**
 * Find all available workbenches to transition to for my workbench
 * @param idType
 * @returns available transitions
 */
export const findWorkbenchTransitions = async (idType: string) => {
  const views = await ViewUtils.findVisynViews(IDTypeManager.getInstance().resolveIdType(idType));
  return views.filter((v) => isVisynRankingViewDesc(v)) as OrdinoRankingViewPluginDesc[];
};
