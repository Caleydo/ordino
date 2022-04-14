import { createSlice } from '@reduxjs/toolkit';
export var EViewDirections;
(function (EViewDirections) {
    EViewDirections["N"] = "n";
    EViewDirections["S"] = "s";
    EViewDirections["W"] = "w";
    EViewDirections["E"] = "e";
})(EViewDirections || (EViewDirections = {}));
export var EWorkbenchDirection;
(function (EWorkbenchDirection) {
    EWorkbenchDirection["VERTICAL"] = "vertical";
    EWorkbenchDirection["HORIZONTAL"] = "horizontal";
})(EWorkbenchDirection || (EWorkbenchDirection = {}));
const initialState = {
    workbenches: [],
    focusWorkbenchIndex: 0,
    colorMap: {},
};
const ordinoSlice = createSlice({
    name: 'ordino',
    initialState,
    reducers: {
        // TODO in general: does it make sense to group the reducer functions (e.g., by workbench, views, ...)? or even create multiple variables that are spread-in here.
        addFirstWorkbench(state, action) {
            state.focusWorkbenchIndex = 0;
            state.workbenches.splice(0, state.workbenches.length);
            state.workbenches.push(action.payload);
        },
        setColorMap(state, action) {
            state.colorMap = action.payload.colorMap;
        },
        addWorkbench(state, action) {
            if (state.workbenches.length > action.payload.index) {
                state.workbenches.splice(action.payload.index);
            }
            state.workbenches.push(action.payload);
        },
        addView(state, action) {
            state.workbenches[action.payload.workbenchIndex].views.push(action.payload.view);
        },
        setViewParameters(state, action) {
            state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].parameters = action.payload.parameters;
        },
        changeSelectedMappings(state, action) {
            const currentWorkbench = state.workbenches[action.payload.workbenchIndex];
            const { newMapping } = action.payload;
            if (!currentWorkbench.selectedMappings.find((m) => {
                const { entityId, columnSelection } = newMapping;
                return m.entityId === entityId && m.columnSelection === columnSelection;
            })) {
                currentWorkbench.selectedMappings.push(newMapping);
            }
            else {
                currentWorkbench.selectedMappings = currentWorkbench.selectedMappings.filter((m) => {
                    const { entityId, columnSelection } = newMapping;
                    return !(m.entityId === entityId && m.columnSelection === columnSelection);
                });
            }
        },
        setDetailsSidebarOpen(state, action) {
            state.workbenches[action.payload.workbenchIndex].detailsSidebarOpen = action.payload.open;
        },
        setCreateNextWorkbenchSidebarOpen(state, action) {
            state.workbenches[action.payload.workbenchIndex].createNextWorkbenchSidebarOpen = action.payload.open;
        },
        setView(state, action) {
            state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].id = action.payload.viewId;
            state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].name = action.payload.viewName;
        },
        createColumnDescs(state, action) {
            const { workbenchIndex, desc } = action.payload;
            state.workbenches[workbenchIndex].columnDescs = desc;
        },
        addColumnDesc(state, action) {
            const { workbenchIndex } = action.payload;
            state.workbenches[workbenchIndex].columnDescs.push(action.payload.desc);
        },
        addEntityFormatting(state, action) {
            const { workbenchIndex, formatting } = action.payload;
            state.workbenches[workbenchIndex].formatting = formatting;
        },
        switchViews(state, action) {
            const temp = state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex];
            state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex] =
                state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex];
            state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex] = temp;
        },
        setWorkbenchDirection(state, action) {
            state.workbenches[action.payload.workbenchIndex].viewDirection = action.payload.direction;
        },
        removeWorkbench(state, action) {
            state.workbenches.slice(action.payload.index);
        },
        // TODO:: When we remove the views jump too much. We need to do something smarter based on what the direction is to figure out where to move the still existing views.
        removeView(state, action) {
            const workbench = state.workbenches[action.payload.workbenchIndex];
            workbench.views.splice(action.payload.viewIndex, 1);
        },
        replaceWorkbench(state, action) {
            state.workbenches.splice(action.payload.workbenchIndex);
            state.workbenches.push(action.payload.newWorkbench);
        },
        addSelection(state, action) {
            const { workbenchIndex, newSelection } = action.payload;
            state.workbenches[workbenchIndex].selection = newSelection;
        },
        addFilter(state, action) {
            state.workbenches[action.payload.workbenchIndex].views.find((v) => v.uniqueId === action.payload.viewId).filters = action.payload.filter;
        },
        changeFocus(state, action) {
            state.focusWorkbenchIndex = action.payload.index;
        },
        setWorkbenchData(state, action) {
            const { workbenchIndex, data } = action.payload;
            for (const row of data) {
                state.workbenches[workbenchIndex].data[row.id] = row;
            }
        },
        addScoreColumn(state, action) {
            const { workbenchIndex, desc, data } = action.payload;
            state.workbenches[workbenchIndex].columnDescs.push(desc);
            for (const row of data) {
                const dataRow = state.workbenches[workbenchIndex].data[row.id];
                if (dataRow) {
                    dataRow[desc.scoreID] = row.score;
                } // TODO: BUG the score should not add a new row when the id does not exist in my current data else {
                //   state.workbenches[state.focusViewIndex].data[row.id] = row;
                // }
            }
        },
        setCommentsOpen(state, action) {
            const { workbenchIndex, open } = action.payload;
            state.workbenches[workbenchIndex].commentsOpen = open;
        },
    },
});
export const { addView, setColorMap, changeSelectedMappings, setDetailsSidebarOpen, setCreateNextWorkbenchSidebarOpen, setViewParameters, createColumnDescs, setView, addColumnDesc, removeView, replaceWorkbench, addEntityFormatting, addScoreColumn, addSelection, addFilter, setWorkbenchData, changeFocus, addFirstWorkbench, addWorkbench, switchViews, setWorkbenchDirection, setCommentsOpen, } = ordinoSlice.actions;
export const ordinoReducer = ordinoSlice.reducer;
//# sourceMappingURL=ordinoSlice.js.map