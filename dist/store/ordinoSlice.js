import { createSlice } from '@reduxjs/toolkit';
export var EViewDirections;
(function (EViewDirections) {
    EViewDirections["N"] = "n";
    EViewDirections["S"] = "s";
    EViewDirections["W"] = "w";
    EViewDirections["E"] = "e";
})(EViewDirections || (EViewDirections = {}));
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
        addTransitionOptions(state, action) {
            state.workbenches[action.payload.workbenchIndex].transitionOptions = action.payload.transitionOptions;
        },
        addColumnDescs(state, action) {
            state.workbenches[state.focusViewIndex].columnDescs = action.payload.descs;
        },
        switchViews(state, action) {
            console.log(action.payload.firstViewIndex, action.payload.secondViewIndex);
            const temp = state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex];
            temp.index = action.payload.secondViewIndex;
            state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex] = state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex];
            state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex].index = action.payload.firstViewIndex;
            state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex] = temp;
        },
        setWorkbenchDirection(state, action) {
            state.workbenches[action.payload.workbenchIndex].viewDirection = action.payload.direction;
        },
        removeWorkbench(state, action) {
            state.workbenches.slice(action.payload.index);
        },
        //TODO:: When we remove the views jump too much. We need to something smarter based on what the direction is to figure out where to move the still existing views.
        removeView(state, action) {
            const workbench = state.workbenches[action.payload.workbenchIndex];
            workbench.views.splice(action.payload.viewIndex, 1);
            for (let j = 0; j < workbench.views.length; j++) {
                workbench.views[j].index = j;
            }
        },
        replaceWorkbench(state, action) {
            state.workbenches.splice(action.payload.workbenchIndex);
            state.workbenches.push(action.payload.newWorkbench);
        },
        addSelection(state, action) {
            state.workbenches[state.focusViewIndex].selections = action.payload.newSelection;
        },
        addFilter(state, action) {
            state.workbenches[state.focusViewIndex].filters = action.payload.filter;
        },
        changeFocus(state, action) {
            state.focusViewIndex = action.payload.index;
        },
        setWorkbenchData(state, action) {
            for (const i of action.payload.data) {
                state.workbenches[state.focusViewIndex].data[i._id] = i;
            }
        },
        addScoreColumn(state, action) {
            for (const i of action.payload.data) {
                state.workbenches[state.focusViewIndex].data[i.id][action.payload.columnName] = i.score;
            }
        },
    }
});
export const { addView, addColumnDescs, removeView, addTransitionOptions, replaceWorkbench, addScoreColumn, addSelection, addFilter, setWorkbenchData, changeFocus, addFirstWorkbench, addWorkbench, switchViews, setWorkbenchDirection } = ordinoSlice.actions;
export const ordinoReducer = ordinoSlice.reducer;
//# sourceMappingURL=ordinoSlice.js.map