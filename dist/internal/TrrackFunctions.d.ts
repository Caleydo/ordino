import { Provenance } from "../trrack/src/index";
import { IDataProviderDump } from 'lineupjs';
export declare type DemoState = {
    viewList: View[];
    focusView: number;
};
declare type View = {
    viewId: string;
    idType: string;
    selection: string;
    options: any;
    dump: IDataProviderDump;
};
export declare type OrdinoEvents = "Create View" | "Remove View" | "Replace View" | "Change Focus View" | "Select Focus" | "Select Secondary" | "Lineup Action";
export declare const provenanceActions: {
    createViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [string, string, string, any]>;
    removeViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [number]>;
    focusViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [number]>;
    selectFocusAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [string, string]>;
    selectSecondaryAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [string, string]>;
    replaceViewAction: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [number, string, string, string, any]>;
    allLineupActions: import("../trrack/src").ActionObject<DemoState, OrdinoEvents, [IDataProviderDump, number]>;
};
export declare const prov: Provenance<DemoState, any, OrdinoEvents>;
export {};
