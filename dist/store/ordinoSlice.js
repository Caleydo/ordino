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
const initialState = {
    workbenches: [],
    focusViewIndex: 0,
};
const ordinoSlice = createSlice({
    name: 'ordino',
    initialState,
    reducers: {
        addFirstWorkbench(state, action) {
            state.workbenches.splice(0, state.workbenches.length);
            state.workbenches.push(action.payload);
        },
        addWorkbench(state, action) {
            state.workbenches.push(action.payload);
        },
        addView(state, action) {
            state.workbenches[action.payload.workbenchIndex].views.push(action.payload.view);
        },
        setViewParameters(state, action) {
            state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].parameters = action.payload.parameters;
        },
        setView(state, action) {
            state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].id = action.payload.viewId;
        },
        addTransitionOptions(state, action) {
            state.workbenches[action.payload.workbenchIndex].transitionOptions = action.payload.transitionOptions;
        },
        createColumnDescs(state, action) {
            state.workbenches.find((f) => f.entityId.endsWith(action.payload.entityId)).columnDescs = action.payload.desc;
        },
        addColumnDesc(state, action) {
            state.workbenches.find((f) => f.entityId.endsWith(action.payload.entityId)).columnDescs = action.payload.desc;
        },
        switchViews(state, action) {
            console.log(action.payload.firstViewIndex, action.payload.secondViewIndex);
            const temp = state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex];
            state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex] = state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex];
            state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex] = temp;
        },
        setWorkbenchDirection(state, action) {
            state.workbenches[action.payload.workbenchIndex].viewDirection = action.payload.direction;
        },
        removeWorkbench(state, action) {
            state.workbenches.slice(action.payload.index);
        },
        //TODO:: When we remove the views jump too much. We need to do something smarter based on what the direction is to figure out where to move the still existing views.
        removeView(state, action) {
            const workbench = state.workbenches[action.payload.workbenchIndex];
            workbench.views.splice(action.payload.viewIndex, 1);
        },
        replaceWorkbench(state, action) {
            state.workbenches.splice(action.payload.workbenchIndex);
            state.workbenches.push(action.payload.newWorkbench);
        },
        addSelection(state, action) {
            state.workbenches[state.focusViewIndex].selectionIds = action.payload.newSelection;
        },
        addFilter(state, action) {
            state.workbenches[state.focusViewIndex].views.find((v) => v.id === action.payload.viewId).filters = action.payload.filter;
        },
        changeFocus(state, action) {
            state.focusViewIndex = action.payload.index;
        },
        setWorkbenchData(state, action) {
            console.log(action.payload.data, action.payload.entityId);
            for (const i of action.payload.data) {
                state.workbenches.find((f) => f.entityId.endsWith(action.payload.entityId)).data[i._visyn_id] = i;
            }
        },
        addScoreColumn(state, action) {
            for (const row of action.payload.data) {
                state.workbenches[state.focusViewIndex].data[row.id][action.payload.columnName] = row.score;
            }
        },
    }
});
export const { addView, setViewParameters, createColumnDescs, setView, addColumnDesc, removeView, addTransitionOptions, replaceWorkbench, addScoreColumn, addSelection, addFilter, setWorkbenchData, changeFocus, addFirstWorkbench, addWorkbench, switchViews, setWorkbenchDirection } = ordinoSlice.actions;
export const ordinoReducer = ordinoSlice.reducer;
//# sourceMappingURL=ordinoSlice.js.map