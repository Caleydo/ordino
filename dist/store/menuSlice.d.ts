export interface IMenuState {
    activeTab: string;
    mode: EStartMenuMode;
    currentProject: string;
    allProjects: string[];
}
export declare enum EStartMenuMode {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    START = "start",
    /**
     * an analysis in the background, the start menu can be closed
     */
    OVERLAY = "overlay"
}
export declare enum EStartMenuOpen {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    OPEN = "open",
    /**
     * an analysis in the background, the start menu can be closed
     */
    CLOSED = "closed"
}
export declare const setActiveTab: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>, setMode: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EStartMenuMode, string>, setCurrentProject: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>, setAllProjects: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string[], string>;
export declare const menuReducer: import("redux").Reducer<IMenuState, import("redux").AnyAction>;
//# sourceMappingURL=menuSlice.d.ts.map