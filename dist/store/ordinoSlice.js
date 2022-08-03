import { createTrrackableSlice } from '@trrack/redux';
import { viewsReducers } from './viewsReducer';
import { workbenchReducers } from './workbenchReducer';
const initialState = {
    workbenches: [],
    focusWorkbenchIndex: 0,
    midTransition: false,
    colorMap: {},
    isAnimating: false,
};
export const ordinoSlice = createTrrackableSlice({
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
            state.midTransition = false;
            state.isAnimating = true;
        },
        setTransition(state, action) {
            state.midTransition = action.payload;
        },
        setAnimating(state, action) {
            state.isAnimating = action.payload;
        },
    },
});
export const { addView, setColorMap, changeSelectedMappings, setDetailsSidebarOpen, setCreateNextWorkbenchSidebarOpen, setViewParameters, createColumnDescs, setView, addColumnDesc, removeView, replaceWorkbench, removeWorkbench, addEntityFormatting, addScoreColumn, addSelection, addFilter, setWorkbenchData, changeFocus, addFirstWorkbench, addWorkbench, switchViews, setWorkbenchDirection, setCommentsOpen, setTransition, setAnimating, } = ordinoSlice.actions;
export const ordinoReducer = ordinoSlice.reducer;
//# sourceMappingURL=ordinoSlice.js.map