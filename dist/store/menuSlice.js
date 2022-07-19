import { createSlice } from '@reduxjs/toolkit';
export var EStartMenuMode;
(function (EStartMenuMode) {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    EStartMenuMode["START"] = "start";
    /**
     * an analysis in the background, the start menu can be closed
     */
    EStartMenuMode["OVERLAY"] = "overlay";
})(EStartMenuMode || (EStartMenuMode = {}));
export var EStartMenuOpen;
(function (EStartMenuOpen) {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    EStartMenuOpen["OPEN"] = "open";
    /**
     * an analysis in the background, the start menu can be closed
     */
    EStartMenuOpen["CLOSED"] = "closed";
})(EStartMenuOpen || (EStartMenuOpen = {}));
const initialState = {
    activeTab: null,
    mode: EStartMenuMode.START,
    currentProject: null,
};
const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setActiveTab(state, action) {
            state.activeTab = action.payload;
        },
        setMode(state, action) {
            state.mode = action.payload;
        },
        setCurrentProject(state, action) {
            state.currentProject = action.payload;
        },
    },
});
export const { setActiveTab, setMode, setCurrentProject } = menuSlice.actions;
export const menuReducer = menuSlice.reducer;
//# sourceMappingURL=menuSlice.js.map