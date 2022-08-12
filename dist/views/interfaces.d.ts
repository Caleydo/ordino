/// <reference types="react" />
import { IColumnDesc } from 'lineupjs';
import { DefineVisynViewPlugin, IScoreRow, IServerColumn, VisynDataViewPluginType, VisynSimpleViewPluginType } from 'tdp_core';
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
export declare type OrdinoSimpleViewPluginType<Param extends Record<string, unknown> = Record<string, unknown>, Desc extends Record<string, unknown> = Record<string, unknown>> = VisynSimpleViewPluginType<Param, Desc & IOrdinoVisynViewDesc>;
/**
 * Extend `OrdinoDataViewPluginType` with `IOrdinoVisynViewDesc`
 * to enable type checking and auto-complete for the plugin desc
 * when registering the views.
 */
export declare type OrdinoDataViewPluginType<Param extends Record<string, unknown> = Record<string, unknown>, Desc extends Record<string, unknown> = Record<string, unknown>> = VisynDataViewPluginType<Param, Desc & IOrdinoVisynViewDesc>;
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
}, Desc & IOrdinoRankingViewDesc>;
export declare type OrdinoRankingViewPluginDesc = OrdinoRankingViewPluginType['desc'];
export declare type OrdinoRankingViewPlugin = OrdinoRankingViewPluginType['plugin'];
export declare function isVisynRankingViewDesc(desc: unknown): desc is OrdinoRankingViewPluginDesc;
export declare function isVisynRankingView(plugin: unknown): plugin is OrdinoRankingViewPlugin;
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
        } & Record<string, unknown> & IOrdinoRankingViewDesc;
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
            } & Record<string, unknown> & IOrdinoRankingViewDesc & import("tdp_core").IPluginDesc;
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
            } & Record<string, unknown> & IOrdinoRankingViewDesc & import("tdp_core").IPluginDesc;
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
            } & Record<string, unknown> & IOrdinoRankingViewDesc & import("tdp_core").IPluginDesc;
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
            } & Record<string, unknown> & IOrdinoRankingViewDesc & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, unknown> & IOrdinoRankingViewParam;
            onSelectionChanged(selection: import("react").SetStateAction<string[]>): void;
            onParametersChanged(parameters: import("react").SetStateAction<Record<string, unknown> & IOrdinoRankingViewParam>): void;
        }>>;
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
            } & Record<string, unknown> & IOrdinoRankingViewDesc & import("tdp_core").IPluginDesc;
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
            } & Record<string, unknown> & IOrdinoRankingViewDesc & import("tdp_core").IPluginDesc;
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
} & Record<string, unknown> & IOrdinoRankingViewDesc & import("tdp_core").IPluginDesc)[]>;
//# sourceMappingURL=interfaces.d.ts.map