/// <reference types="react" />
import { IColumnDesc } from 'lineupjs';
import { DefineVisynViewPlugin, IScoreRow, IServerColumn } from 'tdp_core';
import { IOrdinoRelation } from '../base';
import { ISelectedMapping, IWorkbench } from '../store';
export interface IOrdinoVisynViewDesc {
    relation: IOrdinoRelation;
}
export interface IOrdinoRankingViewParam {
    prevSelection: string[];
    selectedMappings: ISelectedMapping[];
    globalQueryName: string;
    appliedQueryCategories: (number | string)[];
}
export declare type OrdinoRankingViewPluginType<Param extends Record<string, unknown> = Record<string, unknown>, Desc extends Record<string, unknown> = Record<string, unknown>> = DefineVisynViewPlugin<'ranking', Param & IOrdinoRankingViewParam, {
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
    onAddScoreColumn(desc: IColumnDesc & {
        [key: string]: any;
    }, data: IScoreRow<any>[]): void;
    /**
     * add formatting information to the workbench: when showing an entity's selected item we might want to display
     * a string from a column other than the selection id.
     * @param formatting TODO add typings once Ollie's interface refactoring is finished
     */
    onAddFormatting(formatting: IWorkbench['formatting']): void;
}, Desc & IOrdinoVisynViewDesc>;
export declare type OrdinoVisynViewPluginDesc = OrdinoRankingViewPluginType['desc'];
export declare type OrdinoVisynViewPlugin = OrdinoRankingViewPluginType['plugin'];
export declare function isVisynRankingViewDesc(desc: unknown): desc is OrdinoVisynViewPluginDesc;
export declare function isVisynRankingView(plugin: unknown): plugin is OrdinoVisynViewPlugin;
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
            defaultParameters?: Record<string, unknown> & IOrdinoRankingViewParam;
        } & Record<string, unknown> & IOrdinoVisynViewDesc;
        viewType: "ranking";
        defaultParameters: Record<string, unknown> & IOrdinoRankingViewParam;
        factory: never;
    } & {
        view: import("react").ComponentType<{
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
            onAddScoreColumn(desc: IColumnDesc & {
                [key: string]: any;
            }, data: IScoreRow<any>[]): void;
            /**
             * add formatting information to the workbench: when showing an entity's selected item we might want to display
             * a string from a column other than the selection id.
             * @param formatting TODO add typings once Ollie's interface refactoring is finished
             */
            onAddFormatting(formatting: IWorkbench['formatting']): void;
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoRankingViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoRankingViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoRankingViewParam>): void;
        }> | import("react").LazyExoticComponent<import("react").ComponentType<{
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
            onAddScoreColumn(desc: IColumnDesc & {
                [key: string]: any;
            }, data: IScoreRow<any>[]): void;
            /**
             * add formatting information to the workbench: when showing an entity's selected item we might want to display
             * a string from a column other than the selection id.
             * @param formatting TODO add typings once Ollie's interface refactoring is finished
             */
            onAddFormatting(formatting: IWorkbench['formatting']): void;
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoRankingViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoRankingViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoRankingViewParam>): void;
        }>>;
        header?: import("react").ComponentType<{
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
            onAddScoreColumn(desc: IColumnDesc & {
                [key: string]: any;
            }, data: IScoreRow<any>[]): void;
            /**
             * add formatting information to the workbench: when showing an entity's selected item we might want to display
             * a string from a column other than the selection id.
             * @param formatting TODO add typings once Ollie's interface refactoring is finished
             */
            onAddFormatting(formatting: IWorkbench['formatting']): void;
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoRankingViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoRankingViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoRankingViewParam>): void;
        }> | import("react").LazyExoticComponent<import("react").ComponentType<{
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
            onAddScoreColumn(desc: IColumnDesc & {
                [key: string]: any;
            }, data: IScoreRow<any>[]): void;
            /**
             * add formatting information to the workbench: when showing an entity's selected item we might want to display
             * a string from a column other than the selection id.
             * @param formatting TODO add typings once Ollie's interface refactoring is finished
             */
            onAddFormatting(formatting: IWorkbench['formatting']): void;
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoRankingViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoRankingViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoRankingViewParam>): void;
        }>>;
        /**
         * Callback when the Column Description changed.
         * @param desc New Column Description.
         */
        tab?: import("react").ComponentType<{
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
            onAddScoreColumn(desc: IColumnDesc & {
                [key: string]: any;
            }, data: IScoreRow<any>[]): void;
            /**
             * add formatting information to the workbench: when showing an entity's selected item we might want to display
             * a string from a column other than the selection id.
             * @param formatting TODO add typings once Ollie's interface refactoring is finished
             */
            onAddFormatting(formatting: IWorkbench['formatting']): void;
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoRankingViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoRankingViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoRankingViewParam>): void;
        }> | import("react").LazyExoticComponent<import("react").ComponentType<{
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
            onAddScoreColumn(desc: IColumnDesc & {
                [key: string]: any;
            }, data: IScoreRow<any>[]): void;
            /**
             * add formatting information to the workbench: when showing an entity's selected item we might want to display
             * a string from a column other than the selection id.
             * @param formatting TODO add typings once Ollie's interface refactoring is finished
             */
            onAddFormatting(formatting: IWorkbench['formatting']): void;
        } & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: "ranking";
                defaultParameters?: Record<string, unknown> & IOrdinoRankingViewParam;
            } & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoRankingViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoRankingViewParam>): void;
        }>>;
    } & import("tdp_core").IPlugin>;
} & import("tdp_core").IBaseViewPluginDesc & {
    readonly [key: string]: any;
    visynViewType: "ranking";
    defaultParameters?: Record<string, unknown> & IOrdinoRankingViewParam;
} & Record<string, unknown> & IOrdinoVisynViewDesc & import("tdp_core").IPluginDesc)[]>;
//# sourceMappingURL=interfaces.d.ts.map