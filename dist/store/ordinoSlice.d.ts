import { IRow, IViewPluginDesc } from 'tdp_core';
import type { IReprovisynServerColumn } from 'reprovisyn';
export declare enum EViewDirections {
    N = "n",
    S = "s",
    W = "w",
    E = "e"
}
export interface IWorkbenchView {
    id: string;
    uniqueId: string;
    name: string;
    filters: string[];
    parameters?: any;
}
export interface IOrdinoAppState {
    /**
     * List of open views.
     */
    workbenches: IWorkbench[];
    colorMap: {
        [key: string]: string;
    };
    /**
     * Id of the current focus view
     */
    focusViewIndex: number;
    sidebarOpen: boolean;
}
export declare enum EWorkbenchDirection {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal"
}
export interface ISelectedMapping {
    entityId: string;
    columnSelection: string;
}
export interface IWorkbench {
    /**
     * List of open views. The order of the views in this list determines the order they are displayed in the workbench.
     */
    views: IWorkbenchView[];
    selectedMappings: ISelectedMapping[];
    viewDirection: EWorkbenchDirection;
    name: string;
    /**
     * itemIDType of the views in a workbench, should match the itemIDType of the default ranking
     */
    itemIDType: string;
    entityId: string;
    index: number;
    data: {
        [key: string]: IRow;
    };
    columnDescs: IReprovisynServerColumn[];
    transitionOptions: IRow['_visyn_id'][];
    /**
     * List selected rows
     */
    selection: IRow['_visyn_id'][];
    detailsOpen: boolean;
    addWorkbenchOpen: boolean;
}
interface IBaseState {
    selection: string[];
}
export interface IOrdinoViewPlugin<S extends IBaseState> extends IViewPluginDesc {
    state: S;
}
export declare const addView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    view: IWorkbenchView;
}, string>, createColorMap: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    colorMap: {
        [key: string]: string;
    };
}, string>, changeSelectedMappings: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    newMapping: ISelectedMapping;
}, string>, setDetailsOpen: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    open: boolean;
}, string>, setAddWorkbenchOpen: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    open: boolean;
}, string>, setViewParameters: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
    parameters: any;
}, string>, setSidebarOpen: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    open: boolean;
}, string>, createColumnDescs: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    viewId: string;
    desc: any;
}, string>, setView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
    viewId: string;
    viewName: string;
}, string>, addColumnDesc: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    entityId: string;
    desc: any;
}, string>, removeView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
}, string>, addTransitionOptions: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    transitionOptions: string[];
}, string>, replaceWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    newWorkbench: IWorkbench;
}, string>, addScoreColumn: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    columnName: string;
    data: any[];
}, string>, addSelection: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    newSelection: string[];
}, string>, addFilter: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewId: string;
    filter: string[];
}, string>, setWorkbenchData: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    viewId: string;
    data: any[];
}, string>, changeFocus: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    index: number;
}, string>, addFirstWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IWorkbench, string>, addWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IWorkbench, string>, switchViews: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    firstViewIndex: number;
    secondViewIndex: number;
}, string>, setWorkbenchDirection: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    direction: EWorkbenchDirection;
}, string>;
export declare const ordinoReducer: import("redux").Reducer<IOrdinoAppState, import("redux").AnyAction>;
export {};
//# sourceMappingURL=ordinoSlice.d.ts.map