import { createSlice } from '@reduxjs/toolkit';
export var ETabStates;
(function (ETabStates) {
    ETabStates["NONE"] = "none";
    ETabStates["DATASETS"] = "datasets";
    ETabStates["ANALYSIS"] = "analysis";
    ETabStates["TOURS"] = "tours";
})(ETabStates || (ETabStates = {}));
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
    workbenches: [{
            index: 0,
            views: [
                {
                    id: 'view_0',
                    index: 0,
                    name: 'Start view',
                    selection: 'multiple',
                    selections: [],
                    group: {
                        name: 'General',
                        order: 10
                    }
                }
            ],
            name: 'Start View',
            id: 'startView',
            selections: [],
            filters: []
        }],
    focusViewIndex: 0,
    activeTab: ETabStates.NONE
};
const ordinoSlice = createSlice({
    name: 'ordino',
    initialState,
    reducers: {
        addWorkbench(state, action) {
            state.workbenches.push(action.payload);
        },
        addView(state, action) {
            state.workbenches[action.payload.workbenchIndex].views.push(action.payload.view);
        },
        removeWorkbench(state, action) {
            state.workbenches.slice(action.payload.index);
        },
        removeView(state, action) {
            state.workbenches[action.payload.workbenchIndex].views.slice(action.payload.viewIndex);
        },
        replaceWorkbench(state, action) {
            state.workbenches.splice(action.payload.workbenchIndex);
            state.workbenches.push(action.payload.newWorkbench);
        },
        addSelection(state, action) {
            state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].selections = action.payload.newSelection;
        },
        addFilter(state, action) {
            state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].filters.push(action.payload.newFilter);
        },
        changeFocus(state, action) {
            state.focusViewIndex = action.payload.index;
        },
        setActiveTab(state, action) {
            state.activeTab = action.payload.activeTab;
        }
    }
});
export const { addView, removeView, replaceWorkbench, addSelection, addFilter, setActiveTab, changeFocus, addWorkbench } = ordinoSlice.actions;
export const ordinoReducer = ordinoSlice.reducer;
//# sourceMappingURL=ordinoSlice.js.map