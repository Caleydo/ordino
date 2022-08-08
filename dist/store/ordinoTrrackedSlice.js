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
export const ordinoTrrackedSlice = createTrrackableSlice({
    name: 'ordino',
    initialState,
    reducers: {
        ...viewsReducers,
        ...workbenchReducers,
        // TODO in general: does it make sense to group the reducer functions (e.g., by workbench, views, ...)? or even create multiple variables that are spread-in here.
        changeFocus(state, action) {
            state.focusWorkbenchIndex = action.payload.index;
            state.midTransition = false;
        },
        addEntityFormatting(state, action) {
            const { workbenchIndex, formatting } = action.payload;
            state.workbenches[workbenchIndex].formatting = formatting;
        },
        setDetailsSidebarOpen(state, action) {
            state.workbenches[action.payload.workbenchIndex].detailsSidebarOpen = action.payload.open;
        },
        createColumnDescs(state, action) {
            const { workbenchIndex, desc } = action.payload;
            state.workbenches[workbenchIndex].columnDescs = desc;
        },
        addColumnDesc(state, action) {
            const { workbenchIndex } = action.payload;
            state.workbenches[workbenchIndex].columnDescs.push(action.payload.desc);
        },
        setWorkbenchData(state, action) {
            const { workbenchIndex, data } = action.payload;
            for (const row of data) {
                state.workbenches[workbenchIndex].data[row.id] = row;
            }
        },
        setColorMap(state, action) {
            state.colorMap = action.payload.colorMap;
        },
        setTransition(state, action) {
            state.midTransition = action.payload;
        },
        setAnimating(state, action) {
            state.isAnimating = action.payload;
        },
    },
});
export const { setColorMap, setDetailsSidebarOpen, createColumnDescs, addColumnDesc, setWorkbenchData, addView, changeSelectedMappings, setViewParameters, addEntityFormatting, setView, removeView, replaceWorkbench, removeWorkbench, addScoreColumn, addSelection, addFilter, changeFocus, addFirstWorkbench, addWorkbench, switchViews, setTransition, setAnimating, } = ordinoTrrackedSlice.actions;
export const ordinoTrrackedReducer = ordinoTrrackedSlice.reducer;
//# sourceMappingURL=ordinoTrrackedSlice.js.map