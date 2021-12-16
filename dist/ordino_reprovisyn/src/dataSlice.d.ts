export interface IAppState {
    ready: boolean;
}
export declare function setupData(): void;
export declare const setReady: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, string>;
export declare const appReducer: import("redux").Reducer<IAppState, import("redux").AnyAction>;