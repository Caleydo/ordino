import { PayloadAction } from '@reduxjs/toolkit';
import { IOrdinoAppState, IWorkbench } from './interfaces';
export declare const ordinoSlice: import("@trrack/redux").TrrackableSlice<IOrdinoAppState, {
    setColorMap(state: import("immer/dist/internal").WritableDraft<IOrdinoAppState>, action: {
        payload: {
            colorMap: {
                [key: string]: string;
            };
        };
        type: string;
    }): void;
    addEntityFormatting(state: import("immer/dist/internal").WritableDraft<IOrdinoAppState>, action: PayloadAction<{
        workbenchIndex: number;
        formatting: IWorkbench['formatting'];
    }>): void;
    changeFocus(state: import("immer/dist/internal").WritableDraft<IOrdinoAppState>, action: PayloadAction<{
        index: number;
    }>): void;
    setTransition(state: import("immer/dist/internal").WritableDraft<IOrdinoAppState>, action: PayloadAction<boolean>): void;
    setAnimating(state: import("immer/dist/internal").WritableDraft<IOrdinoAppState>, action: PayloadAction<boolean>): void;
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
    setDetailsSidebarOpen(state: any, action: {
        payload: {
            workbenchIndex: number;
            open: boolean;
        };
        type: string;
    }): void;
    setCreateNextWorkbenchSidebarOpen(state: any, action: {
        payload: {
            workbenchIndex: number;
            open: boolean;
        };
        type: string;
    }): void;
    createColumnDescs(state: any, action: {
        payload: {
            workbenchIndex: number;
            desc: any;
        };
        type: string;
    }): void;
    addColumnDesc(state: any, action: {
        payload: {
            workbenchIndex: number;
            desc: any;
        };
        type: string;
    }): void;
    setWorkbenchDirection(state: any, action: {
        payload: {
            workbenchIndex: number;
            direction: import("./interfaces").EWorkbenchDirection;
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
    setWorkbenchData(state: any, action: {
        payload: {
            workbenchIndex: number;
            data: import("tdp_core").IRow[];
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
    setCommentsOpen(state: any, action: {
        payload: {
            workbenchIndex: number;
            isOpen: boolean;
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
export declare const addView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    view: import("./interfaces").IWorkbenchView;
}, string>, setColorMap: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    colorMap: {
        [key: string]: string;
    };
}, string>, changeSelectedMappings: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    newMapping: import("./interfaces").ISelectedMapping;
}, string>, setDetailsSidebarOpen: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    open: boolean;
}, string>, setCreateNextWorkbenchSidebarOpen: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    open: boolean;
}, string>, setViewParameters: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
    parameters: any;
}, string>, createColumnDescs: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    desc: any;
}, string>, setView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
    viewId: string;
    viewName: string;
}, string>, addColumnDesc: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    desc: any;
}, string>, removeView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    viewIndex: number;
}, string>, replaceWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    newWorkbench: IWorkbench;
}, string>, removeWorkbench: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    index: number;
}, string>, addEntityFormatting: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    formatting: IWorkbench['formatting'];
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
}, string>, setWorkbenchData: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    data: import("tdp_core").IRow[];
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
}, string>, setWorkbenchDirection: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    direction: import("./interfaces").EWorkbenchDirection;
}, string>, setCommentsOpen: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    workbenchIndex: number;
    isOpen: boolean;
}, string>, setTransition: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, string>, setAnimating: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, string>;
export declare const ordinoReducer: import("redux").Reducer<IOrdinoAppState, import("redux").AnyAction>;
//# sourceMappingURL=ordinoSlice.d.ts.map