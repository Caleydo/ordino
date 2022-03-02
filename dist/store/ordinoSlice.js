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
// const test = ({
//   headerOverride = Header,
// }: {
//   headerOverride?: (props: {view: IView[]}) => JSX.Component;
//   overrides: {
//     header: JSX.Component;
//     itemGroup: JSX.Component;
//     header: JSX.Component;
//   }
// }) => <>
//   <headerOverride views={views}></headerOverride>
//   Map( <ListItemGroup>
//     <ListItem>
//     ...)
// </>;
// export interface IOrdinoScatterplotViewPlugin<{
//   color: string;
// }> {
//   state: {
//   }
// }
const containsView = (workbench, viewId) => workbench.views.some(({ uniqueId }) => uniqueId === viewId);
const initialState = {
    workbenches: [],
    focusViewIndex: 0,
    sidebarOpen: false,
    colorMap: {},
};
// TODO: Change rest of methods to use viewId instead of entity id
const ordinoSlice = createSlice({
    name: 'ordino',
    initialState,
    reducers: {
        addFirstWorkbench(state, action) {
            state.focusViewIndex = 0;
            state.workbenches.splice(0, state.workbenches.length);
            state.workbenches.push(action.payload);
        },
        createColorMap(state, action) {
            state.colorMap = action.payload.colorMap;
        },
        addWorkbench(state, action) {
            state.workbenches.push(action.payload);
        },
        addView(state, action) {
            state.workbenches[action.payload.workbenchIndex].views.push(action.payload.view);
        },
        setSidebarOpen(state, action) {
            state.sidebarOpen = action.payload.open;
        },
        setViewParameters(state, action) {
            state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].parameters = action.payload.parameters;
        },
        changeSelectedMappings(state, action) {
            if (!state.workbenches[action.payload.workbenchIndex].selectedMappings.find((m) => {
                return m.entityId === action.payload.newMapping.entityId && m.columnSelection === action.payload.newMapping.columnSelection;
            })) {
                state.workbenches[action.payload.workbenchIndex].selectedMappings.push(action.payload.newMapping);
            }
            else {
                state.workbenches[action.payload.workbenchIndex].selectedMappings = state.workbenches[action.payload.workbenchIndex].selectedMappings.filter((m) => !(m.entityId === action.payload.newMapping.entityId && m.columnSelection === action.payload.newMapping.columnSelection));
            }
        },
        setDetailsOpen(state, action) {
            state.workbenches[action.payload.workbenchIndex].detailsOpen = action.payload.open;
        },
        setAddWorkbenchOpen(state, action) {
            state.workbenches[action.payload.workbenchIndex].addWorkbenchOpen = action.payload.open;
        },
        setView(state, action) {
            state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].id = action.payload.viewId;
            state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].name = action.payload.viewName;
        },
        addTransitionOptions(state, action) {
            state.workbenches[action.payload.workbenchIndex].transitionOptions = action.payload.transitionOptions;
        },
        createColumnDescs(state, action) {
            state.workbenches.find((w) => containsView(w, action.payload.viewId)).columnDescs = action.payload.desc;
        },
        addColumnDesc(state, action) {
            console.log(action.payload.entityId);
            state.workbenches.find((f) => f.entityId.endsWith(action.payload.entityId)).columnDescs.push(action.payload.desc);
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
            state.focusViewIndex = action.payload.index;
        },
        setWorkbenchData(state, action) {
            for (const i of action.payload.data) {
                state.workbenches.find((w) => containsView(w, action.payload.viewId)).data[i.id] = i;
            }
        },
        addScoreColumn(state, action) {
            for (const row of action.payload.data) {
                const dataRow = state.workbenches[state.focusViewIndex].data[row.id];
                if (dataRow) {
                    dataRow[action.payload.columnName] = row.score;
                } // TODO: BUG the score should not add a new row when the id id does not exist in my current data else {
                //   state.workbenches[state.focusViewIndex].data[row.id] = row;
                // }
            }
        },
    },
});
export const { addView, createColorMap, changeSelectedMappings, setDetailsOpen, setAddWorkbenchOpen, setViewParameters, setSidebarOpen, createColumnDescs, setView, addColumnDesc, removeView, addTransitionOptions, replaceWorkbench, addScoreColumn, addSelection, addFilter, setWorkbenchData, changeFocus, addFirstWorkbench, addWorkbench, switchViews, setWorkbenchDirection, } = ordinoSlice.actions;
export const ordinoReducer = ordinoSlice.reducer;
//# sourceMappingURL=ordinoSlice.js.map