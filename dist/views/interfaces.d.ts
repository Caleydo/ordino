/// <reference types="react" />
import { IColumnDesc } from 'lineupjs';
import { DefineVisynViewPlugin, IScoreRow, IServerColumn } from 'tdp_core';
import { IOrdinoRelation } from '../base';
import { ISelectedMapping } from '../store/ordinoSlice';
export interface IOrdinoVisynViewDesc {
    relation: IOrdinoRelation;
}
export interface IOrdinoVisynViewParam {
    prevSelection: string[];
    selectedMappings: ISelectedMapping[];
}
export declare type OrdinoVisynViewPluginType<Param extends Record<string, unknown> = Record<string, unknown>, Desc extends Record<string, unknown> = Record<string, unknown>> = DefineVisynViewPlugin<'ranking', Param & IOrdinoVisynViewParam, {
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
}, Desc & IOrdinoVisynViewDesc>;
export declare type OrdinoVisynViewPluginDesc = OrdinoVisynViewPluginType['desc'];
export declare type OrdinoVisynViewPlugin = OrdinoVisynViewPluginType['plugin'];
export declare function isVisynRankingViewDesc(desc: unknown): desc is OrdinoVisynViewPluginType['desc'];
export declare function isVisynRankingView(plugin: unknown): plugin is OrdinoVisynViewPluginType['plugin'];
/**
 * Find all available workbenches to transition to for my workbench
 * @param idType
 * @returns available transitions
 */
export declare const findWorkbenchTransitions: (idType: string) => Promise<({
    load(): Promise<{
        desc: any & import("tdp_core").IBaseViewPluginDesc & {
            readonly [key: string]: any;
            visynViewType: "ranking";
            defaultParameters?: Record<string, unknown> & IOrdinoVisynViewParam;
        } & Record<string, unknown> & IOrdinoVisynViewDesc;
        viewType: "ranking";
        defaultParameters: Record<string, unknown> & IOrdinoVisynViewParam;
        factory: never;
    } & {
        view: import("react").ComponentType<{
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
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoVisynViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoVisynViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoVisynViewParam>): void;
        }> | import("react").LazyExoticComponent<import("react").ComponentType<{
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
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoVisynViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoVisynViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoVisynViewParam>): void;
        }>>;
        header?: import("react").ComponentType<{
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
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoVisynViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoVisynViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoVisynViewParam>): void;
        }> | import("react").LazyExoticComponent<import("react").ComponentType<{
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
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoVisynViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoVisynViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoVisynViewParam>): void;
        }>>;
        tab?: import("react").ComponentType<{
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
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoVisynViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoVisynViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoVisynViewParam>): void;
        }> | import("react").LazyExoticComponent<import("react").ComponentType<{
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
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoVisynViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoVisynViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoVisynViewParam>): void;
        }>>;
    } & import("tdp_core").IPlugin>;
} & import("tdp_core").IBaseViewPluginDesc & {
    readonly [key: string]: any;
    visynViewType: "ranking";
    defaultParameters?: Record<string, unknown> & IOrdinoVisynViewParam;
} & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc)[]>;
//# sourceMappingURL=interfaces.d.ts.map