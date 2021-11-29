import { IViewPluginDesc } from 'tdp_core';
export declare enum EViewDirections {
    N = "n",
    S = "s",
    W = "w",
    E = "e"
}
export interface IWorkbenchView extends Omit<IViewPluginDesc, 'load' | 'preview'> {
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
    /**
     * List selected rows
     */
    selections: any[];
    /**
     * Selected filters in this view
     */
    filters: any[];
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
}, string>, removeView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
}, string>, replaceWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    newWorkbench: IWorkbench;
}, string>, addSelection: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
    newSelection: any;
}, string>, addFilter: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
    newFilter: any;
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
