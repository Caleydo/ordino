/// <reference types="react" />
import { IColumnDesc } from 'lineupjs';
import { DefineVisynViewPlugin, IScoreRow, IServerColumn, VisynDataViewPluginType } from 'tdp_core';
export declare type OrdinoVisynViewPluginType<Param extends Record<string, unknown> = Record<string, unknown>, Desc extends Record<string, unknown> = Record<string, unknown>> = DefineVisynViewPlugin<'ranking', Param, {
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
    onAddScoreColumn(desc: IColumnDesc & {
        [key: string]: any;
    }, data: IScoreRow<any>[]): void;
}, Desc>;
export declare function isVisynRankingViewDesc(desc: unknown): desc is VisynDataViewPluginType['desc'];
export declare function isVisynRankingView(plugin: unknown): plugin is VisynDataViewPluginType['plugin'];
//# sourceMappingURL=interfaces.d.ts.map