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
};
export declare type OrdinoEvents = "Create View" | "Remove View" | "Replace View" | "Change Focus View" | "Select Focus" | "Select Secondary";
export declare const provenanceActions: {
    createViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [string, string, string, any]>;
    removeViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [number]>;
    focusViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [number]>;
    selectFocusAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [string, string]>;
    selectSecondaryAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [string, string]>;
    replaceViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [number, string, string, string, any]>;
};
export declare const prov: Provenance<DemoState, any, OrdinoEvents>;
export {};
