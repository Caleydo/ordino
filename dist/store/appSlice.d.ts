import { PayloadAction } from '@reduxjs/toolkit';
export interface IAppState {
    ready: boolean;
}
export declare const appSlice: import("@reduxjs/toolkit").Slice<IAppState, {
    setReady(state: import("immer/dist/internal").WritableDraft<IAppState>, action: PayloadAction<boolean>): void;
}, "app">;
export declare const setReady: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, string>;
export declare const appReducer: import("redux").Reducer<IAppState, import("redux").AnyAction>;
//# sourceMappingURL=appSlice.d.ts.map