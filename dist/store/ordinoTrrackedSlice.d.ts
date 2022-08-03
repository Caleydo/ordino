import { PayloadAction } from '@reduxjs/toolkit';
import { IRow } from 'tdp_core';
import { IOrdinoAppTrackedState, IWorkbench } from './interfaces';
export declare const ordinoTrrackedSlice: import("@trrack/redux").TrrackableSlice<IOrdinoAppTrackedState, {
    changeFocus(state: import("immer/dist/internal").WritableDraft<IOrdinoAppTrackedState>, action: PayloadAction<{
        index: number;
    }>): void;
    addEntityFormatting(state: import("immer/dist/internal").WritableDraft<IOrdinoAppTrackedState>, action: PayloadAction<{
        workbenchIndex: number;
        formatting: IWorkbench['formatting'];
    }>): void;
    setDetailsSidebarOpen(state: import("immer/dist/internal").WritableDraft<IOrdinoAppTrackedState>, action: PayloadAction<{
        workbenchIndex: number;
        open: boolean;
    }>): void;
    createColumnDescs(state: import("immer/dist/internal").WritableDraft<IOrdinoAppTrackedState>, action: PayloadAction<{
        workbenchIndex: number;
        desc: any;
    }>): void;
    addColumnDesc(state: import("immer/dist/internal").WritableDraft<IOrdinoAppTrackedState>, action: PayloadAction<{
        workbenchIndex: number;
        desc: any;
    }>): void;
    setWorkbenchData(state: import("immer/dist/internal").WritableDraft<IOrdinoAppTrackedState>, action: PayloadAction<{
        workbenchIndex: number;
        data: IRow[];
    }>): void;
    setCommentsOpen(state: import("immer/dist/internal").WritableDraft<IOrdinoAppTrackedState>, action: PayloadAction<{
        workbenchIndex: number;
        isOpen: boolean;
    }>): void;
    setColorMap(state: import("immer/dist/internal").WritableDraft<IOrdinoAppTrackedState>, action: {
        payload: {
            colorMap: {
                [key: string]: string;
            };
        };
        type: string;
    }): void;
    setTransition(state: import("immer/dist/internal").WritableDraft<IOrdinoAppTrackedState>, action: PayloadAction<boolean>): void;
    setAnimating(state: import("immer/dist/internal").WritableDraft<IOrdinoAppTrackedState>, action: PayloadAction<boolean>): void;
    addFirstWorkbench(state: any, action: {
        payload: {
            workbench: IWorkbench;
            globalQueryName: string;
            globalQueryCategories: string[];
            appliedQueryCategories: string[];
        };
        type: string;
    }): void;
    addWorkbench(state: any, action: {
        payload: IWorkbench;
        type: string;
    }): void;
    changeSelectedMappings(state: any, action: {
        payload: {
            workbenchIndex: number;
            newMapping: import("./interfaces").ISelectedMapping;
        };
        type: string;
    }): void;
    removeWorkbench(state: any, action: {
        payload: {
            index: number;
        };
        type: string;
    }): void;
    replaceWorkbench(state: any, action: {
        payload: {
            workbenchIndex: number;
            newWorkbench: IWorkbench;
        };
        type: string;
    }): void;
    addSelection(state: any, action: {
        payload: {
            workbenchIndex: number;
            newSelection: string[];
        };
        type: string;
    }): void;
    addFilter(state: any, action: {
        payload: {
            workbenchIndex: number;
            viewId: string;
            filter: string[];
        };
        type: string;
    }): void;
    addScoreColumn(state: any, action: {
        payload: {
            workbenchIndex: number;
            desc: import("lineupjs").IColumnDesc & {
                [key: string]: any;
            };
            data: any[];
        };
        type: string;
    }): void;
    addView(state: any, action: {
        payload: {
            workbenchIndex: number;
            view: import("./interfaces").IWorkbenchView;
        };
        type: string;
    }): void;
    setViewParameters(state: any, action: {
        payload: {
            workbenchIndex: number;
            viewIndex: number;
            parameters: any;
        };
        type: string;
    }): void;
    setView(state: any, action: {
        payload: {
            workbenchIndex: number;
            viewIndex: number;
            viewId: string;
            viewName: string;
        };
        type: string;
    }): void;
    switchViews(state: any, action: {
        payload: {
            workbenchIndex: number;
            firstViewIndex: number;
            secondViewIndex: number;
        };
        type: string;
    }): void;
    removeView(state: any, action: {
        payload: {
            workbenchIndex: number;
            viewIndex: number;
        };
        type: string;
    }): void;
}, "ordino">;
export declare const setColorMap: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    colorMap: {
        [key: string]: string;
    };
}, string>, setTransition: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, string>, setAnimating: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, string>, setDetailsSidebarOpen: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    open: boolean;
}, string>, createColumnDescs: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    desc: any;
}, string>, addColumnDesc: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    desc: any;
}, string>, setWorkbenchData: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    data: IRow[];
}, string>, setCommentsOpen: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    isOpen: boolean;
}, string>, addView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    view: import("./interfaces").IWorkbenchView;
}, string>, changeSelectedMappings: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    newMapping: import("./interfaces").ISelectedMapping;
}, string>, setViewParameters: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
    parameters: any;
}, string>, addEntityFormatting: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    formatting: IWorkbench['formatting'];
}, string>, setView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
    viewId: string;
    viewName: string;
}, string>, removeView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
}, string>, replaceWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    newWorkbench: IWorkbench;
}, string>, removeWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    index: number;
}, string>, addScoreColumn: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    desc: import("lineupjs").IColumnDesc & {
        [key: string]: any;
    };
    data: any[];
}, string>, addSelection: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    newSelection: string[];
}, string>, addFilter: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewId: string;
    filter: string[];
}, string>, changeFocus: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    index: number;
}, string>, addFirstWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbench: IWorkbench;
    globalQueryName: string;
    globalQueryCategories: string[];
    appliedQueryCategories: string[];
}, string>, addWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IWorkbench, string>, switchViews: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    firstViewIndex: number;
    secondViewIndex: number;
}, string>;
export declare const ordinoTrrackedReducer: import("redux").Reducer<IOrdinoAppTrackedState, import("redux").AnyAction>;
//# sourceMappingURL=ordinoTrrackedSlice.d.ts.map