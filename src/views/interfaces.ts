import { IColumnDesc } from 'lineupjs';
import { DefineVisynViewPlugin, IDTypeManager, IScoreRow, IServerColumn, isVisynViewPluginDesc, ViewUtils } from 'tdp_core';
import { IOrdinoRelation } from '../base';
import { ISelectedMapping } from '../store/ordinoSlice';

export interface IOrdinoVisynViewDesc {
  relation: IOrdinoRelation;
}

export interface IOrdinoVisynViewParam {
  prevSelection: string[];
  selectedMappings: ISelectedMapping[];
}

export type OrdinoVisynViewPluginType<
  Param extends Record<string, unknown> = Record<string, unknown>,
  Desc extends Record<string, unknown> = Record<string, unknown>,
> = DefineVisynViewPlugin<
  'ranking',
  Param & IOrdinoVisynViewParam,
  {
    /**
     * Data array matching the columns defined in the `dataDesc`.
     */
    data: Record<string, unknown>[];
    /**
     * Data column description describing the given `data`.
     * TODO:: Type to IReprovisynServerColumn when we merge that into tdp_core
     */
    dataDesc: IServerColumn[] | any[];

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
  },
  Desc & IOrdinoVisynViewDesc
>;

export type OrdinoVisynViewPluginDesc = OrdinoVisynViewPluginType['desc'];
export type OrdinoVisynViewPlugin = OrdinoVisynViewPluginType['plugin'];

export function isVisynRankingViewDesc(desc: unknown): desc is OrdinoVisynViewPluginType['desc'] {
  return isVisynViewPluginDesc(desc) && (<any>desc)?.visynViewType === 'ranking';
}

export function isVisynRankingView(plugin: unknown): plugin is OrdinoVisynViewPluginType['plugin'] {
  return isVisynViewPluginDesc((<any>plugin)?.desc) && (<any>plugin)?.viewType === 'ranking';
}

/**
 * Find all available workbenches to transition to for my workbench
 * @param idType
 * @returns available transitions
 */
export const findWorkbenchTransitions = async (idType: string) => {
  const views = await ViewUtils.findVisynViews(IDTypeManager.getInstance().resolveIdType(idType));
  return views.filter((v) => isVisynRankingViewDesc(v)) as OrdinoVisynViewPluginType['desc'][];
};
