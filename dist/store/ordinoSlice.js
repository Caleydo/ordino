import { createSlice } from '@reduxjs/toolkit';
import { viewsReducers } from './viewsReducer';
import { workbenchReducers } from './workbenchReducer';
export const initialOrdinoState = {
    workbenches: [],
    focusWorkbenchIndex: 0,
    colorMap: {},
};
const ordinoSlice = createSlice({
    name: 'ordino',
    initialState: initialOrdinoState,
    reducers: {
        ...viewsReducers,
        ...workbenchReducers,
        // TODO in general: does it make sense to group the reducer functions (e.g., by workbench, views, ...)? or even create multiple variables that are spread-in here.
        setColorMap(state, action) {
            state.colorMap = action.payload.colorMap;
        },
        addEntityFormatting(state, action) {
            const { workbenchIndex, formatting } = action.payload;
            state.workbenches[workbenchIndex].formatting = formatting;
        },
        changeFocus(state, action) {
            state.focusWorkbenchIndex = action.payload.index;
        },
    },
});
export const { addView, setColorMap, changeSelectedMappings, setDetailsSidebarOpen, setCreateNextWorkbenchSidebarOpen, setViewParameters, createColumnDescs, setView, addColumnDesc, removeView, replaceWorkbench, removeWorkbench, addEntityFormatting, addScoreColumn, addSelection, addFilter, setWorkbenchData, changeFocus, addFirstWorkbench, addWorkbench, switchViews, setWorkbenchDirection, setCommentsOpen, } = ordinoSlice.actions;
export const ordinoReducer = ordinoSlice.reducer;
//# sourceMappingURL=ordinoSlice.js.map