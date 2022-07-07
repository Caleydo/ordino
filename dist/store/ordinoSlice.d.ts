import { IOrdinoAppState, IWorkbench } from './interfaces';
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
    globalQuery: import("..").IOrdinoGlobalQuery;
    appliedQueryFilter: import("..").IQueryFilter;
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