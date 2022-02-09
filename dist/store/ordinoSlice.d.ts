import { IRow, IViewPluginDesc } from 'tdp_core';
import type { IReprovisynServerColumn } from 'reprovisyn';
export declare enum EViewDirections {
    N = "n",
    S = "s",
    W = "w",
    E = "e"
}
export interface IWorkbenchView extends Omit<IViewPluginDesc, 'load' | 'preview'> {
    viewType: 'Ranking' | 'Vis';
    filters: string[];
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
export declare enum EWorkbenchDirection {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal"
}
export interface IWorkbench {
    /**
     * List of open views.
     */
    views: IWorkbenchView[];
    viewDirection: EWorkbenchDirection;
    name: string;
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
}, string>, createColumnDescs: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    descs: any[];
}, string>, addColumnDesc: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
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
    data: any;
}, string>, addSelection: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    newSelection: string[];
}, string>, addFilter: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    viewId: string;
    filter: string[];
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
    direction: EWorkbenchDirection;
}, string>;
export declare const ordinoReducer: import("redux").Reducer<IOrdinoAppState, import("redux").AnyAction>;
export {};
//# sourceMappingURL=ordinoSlice.d.ts.map