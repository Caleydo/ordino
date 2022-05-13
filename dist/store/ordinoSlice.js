import { createSlice } from '@reduxjs/toolkit';
import { viewsReducers } from './viewsReducer';
import { workbenchReducers } from './workbenchReducer';
const initialState = {
    workbenches: [],
    focusWorkbenchIndex: 0,
    colorMap: {},
    globalQuery: {
        filter: {
            col: 'species',
            op: 'IN',
            val: ['mouse', 'human'],
        },
        id: 'species',
        name: 'Species',
    },
};
const ordinoSlice = createSlice({
    name: 'ordino',
    initialState,
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
        setCommentsOpen(state, action) {
            const { workbenchIndex, open } = action.payload;
            state.workbenches[workbenchIndex].commentsOpen = open;
        },
    },
});
export const { addView, setColorMap, changeSelectedMappings, setDetailsSidebarOpen, setCreateNextWorkbenchSidebarOpen, setViewParameters, createColumnDescs, setView, addColumnDesc, removeView, replaceWorkbench, removeWorkbench, addEntityFormatting, addScoreColumn, addSelection, addFilter, setWorkbenchData, changeFocus, addFirstWorkbench, addWorkbench, switchViews, setWorkbenchDirection, setCommentsOpen, } = ordinoSlice.actions;
export const ordinoReducer = ordinoSlice.reducer;
//# sourceMappingURL=ordinoSlice.js.map