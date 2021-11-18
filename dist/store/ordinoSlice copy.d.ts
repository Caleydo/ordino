import { IViewPluginDesc } from 'tdp_core';
export interface IOrdinoAppState {
    /**
     * List of open views
     */
    views: IOrdinoViewPluginDesc[];
    /**
     * Id of the current focus view
     */
    focusViewIndex: number;
}
export interface IOrdinoViewPluginDesc extends Omit<IViewPluginDesc, 'load' | 'preview'> {
    index: number;
    /**
     * List selected rows
     */
    selections?: any[];
    /**
     * Selected filters in this view
     */
    filters?: any[];
}
interface IBaseState {
    selection: string[];
}
export interface IOrdinoViewPlugin<S extends IBaseState> extends IViewPluginDesc {
    state: S;
}
export declare const addView: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, removeView: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, replaceView: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, addSelection: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, addFilter: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, setActiveTab: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, changeFocus: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>;
export declare const ordinoReducer: import("redux").Reducer<IOrdinoAppState, import("redux").AnyAction>;
export {};
