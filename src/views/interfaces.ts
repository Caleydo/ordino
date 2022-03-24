import { IColumnDesc } from 'lineupjs';
import { DefineVisynViewPlugin, IScoreResult, IScoreRow, IServerColumn, isVisynViewPluginDesc, VisynDataViewPluginType } from 'tdp_core';

export type OrdinoVisynViewPluginType<
  Param extends Record<string, unknown> = Record<string, unknown>,
  Desc extends Record<string, unknown> = Record<string, unknown>,
> = DefineVisynViewPlugin<
  'ranking',
  Param,
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

    idFilter: string[];

    onIdFilterChanged(idFilter: React.SetStateAction<string[]>): void;

    onColumnDescChanged(desc: IColumnDesc): void;
    onDataChanged(data: any[]): void;
    onAddScoreColumn(
      desc: IColumnDesc & {
        [key: string]: any;
      },
      data: IScoreRow<any>[],
    ): void;
  },
  Desc
>;

export function isVisynRankingViewDesc(desc: unknown): desc is VisynDataViewPluginType['desc'] {
  return isVisynViewPluginDesc(desc) && (<any>desc)?.visynViewType === 'ranking';
}

export function isVisynRankingView(plugin: unknown): plugin is VisynDataViewPluginType['plugin'] {
  return isVisynViewPluginDesc((<any>plugin)?.desc) && (<any>plugin)?.viewType === 'ranking';
}
