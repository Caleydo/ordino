import { EStartMenuMode } from '../components/header/menu/StartMenuTabWrapper';
export interface IMenuState {
    activeTab: string;
    mode: EStartMenuMode;
}
export declare const setActiveTab: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>, setMode: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EStartMenuMode, string>;
export declare const menuReducer: import("redux").Reducer<IMenuState, import("redux").AnyAction>;
