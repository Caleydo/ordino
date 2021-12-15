import { IViewPluginDesc } from 'tdp_core';
export declare enum EViewDirections {
    N = "n",
    S = "s",
    W = "w",
    E = "e"
}
export interface IWorkbenchView extends Omit<IViewPluginDesc, 'load' | 'preview'> {
    viewType: 'Ranking' | 'Vis';
}
export interface IOrdinoAppState {
    /**
     * List of open views. TODO: This should be changed to "workbenches" probably
     */
    workbenches: IWorkbench[];
    /**
     * Id of the current focus view
     */
    focusViewIndex: number;
}
export interface IWorkbench {
    /**
     * List of open views.
     */
    views: IWorkbenchView[];
    viewDirection: 'vertical' | 'horizontal';
    name: string;
    id: string;
    index: number;
    data: {
        [key: number]: any;
    };
    columnDescs: any[];
    /**
     * List selected rows
     */
    selections: number[];
    /**
     * Selected filters in this view
     */
    filters: number[];
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
}, string>, addColumnDescs: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    descs: any[];
}, string>, removeView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
}, string>, replaceWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    newWorkbench: IWorkbench;
}, string>, addScoreColumn: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    columnName: string;
    data: any;
}, string>, addSelection: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    newSelection: number[];
}, string>, addFilter: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    filter: number[];
}, string>, setWorkbenchData: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    data: any[];
}, string>, changeFocus: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    index: number;
}, string>, addFirstWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IWorkbench, string>, addWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IWorkbench, string>, switchViews: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    firstViewIndex: number;
    secondViewIndex: number;
}, string>, setWorkbenchDirection: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    direction: 'vertical' | 'horizontal';
}, string>;
export declare const ordinoReducer: import("redux").Reducer<IOrdinoAppState, import("redux").AnyAction>;
export {};
