import { IOrdinoAppState } from '../interfaces';
import { OrdinoReducer, RootState } from '../store';
import { AnyAction, Middleware } from '@reduxjs/toolkit';
import React, { FC } from 'react';
declare type SetupArgs = {
    initialState: IOrdinoAppState;
    setter?: (state: IOrdinoAppState) => void;
};
declare type TrrackState = {
    state: IOrdinoAppState;
};
export declare function initializeTrrack({ initialState, setter }: SetupArgs): import("@visdesignlab/trrack").Provenance<TrrackState, unknown, unknown>;
export declare type Trrack = ReturnType<typeof initializeTrrack>;
export declare const TRRACK_ACTION = "TRRACK";
export declare const trrackAction: import("@visdesignlab/trrack").ActionObject<TrrackState, void, [IOrdinoAppState]>;
export declare function trrackable(reducer: OrdinoReducer): (state: IOrdinoAppState, action: AnyAction) => IOrdinoAppState;
export declare function setReduxFromTrrackAction(payload: IOrdinoAppState): {
    type: string;
    payload: IOrdinoAppState;
};
export declare const trrackMiddleware: Middleware<{}, RootState>;
export declare const TrrackContext: React.Context<import("@visdesignlab/trrack").Provenance<TrrackState, unknown, unknown>>;
export declare function useTrrack(): import("@visdesignlab/trrack").Provenance<TrrackState, unknown, unknown>;
export declare const TrrackProvider: FC<{
    value: Trrack;
}>;
export {};
//# sourceMappingURL=index.d.ts.map