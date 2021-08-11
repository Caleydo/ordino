import { Provenance } from "../trrack/src/index";
export declare type DemoState = {
    viewList: View[];
    focusView: number;
};
declare type View = {
    viewId: string;
    idType: string;
    selection: string;
    options: any;
    rankings: Ranking[];
};
export declare type Ranking = {
    sort: Sort;
    group: Group;
    columns: Column[];
};
export declare type Sort = {
    rid: number;
    columns: {
        asc: boolean;
        col: string;
    }[];
    isSingleSort: boolean;
};
export declare type Group = {
    rid: number;
    columns: string[];
};
export declare type Column = {
    id: string;
    filter: Filter;
    metadata: Metadata;
};
export declare type Metadata = {
    rid: number;
    col: string;
    label: string;
    summary: string;
    description: string;
};
export declare type Filter = {
    rid: number;
    col: string;
    value: string | string[] | null;
    isRegExp: boolean;
    filterMissing: boolean;
};
export declare type OrdinoEvents = "Create View" | "Remove View" | "Replace View" | "Change Focus View" | "Select Focus" | "Select Secondary" | "Sort View" | "Group View" | "Filter Column";
export declare const provenanceActions: {
    createViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [string, string, string, any]>;
    removeViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [number]>;
    focusViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [number]>;
    selectFocusAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [string, string]>;
    selectSecondaryAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [string, string]>;
    replaceViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [number, string, string, string, any]>;
    sortAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [number, {
        asc: boolean;
        col: string;
    }[], boolean, number]>;
    groupAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [number, string[], number]>;
    filterAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [string, number, string | string[], boolean, boolean, number]>;
    setMetadataAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [string, number, string, string, string, number, any]>;
};
export declare const prov: Provenance<DemoState, any, OrdinoEvents>;
export {};
