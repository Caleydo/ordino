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
    views: [
        {
            id: 'view_0',
            index: 0,
            name: 'Start view',
            selection: 'multiple',
            group: {
                name: 'General',
                order: 10
            }
        }
    ],
    focusViewIndex: 0,
    activeTab: ETabStates.NONE
};
const ordinoSlice = createSlice({
    name: 'ordino',
    initialState,
    reducers: {
        addView(state, action) {
            state.views.push(action.payload);
        },
        removeView(state, action) {
            state.views.slice(action.payload.index);
        },
        replaceView(state, action) {
            state.views.splice(action.payload.index);
            state.views.push(action.payload);
        },
        addSelection(state, action) {
            state.views[action.payload.index].selections.push(action.payload.newSelection);
        },
        addFilter(state, action) {
            state.views[action.payload.index].filters.push(action.payload.newFilter);
        },
        setActiveTab(state, action) {
            state.activeTab = action.payload.activeTab;
        }
    }
});
export const { addView, removeView, replaceView, addSelection, addFilter, setActiveTab } = ordinoSlice.actions;
export const ordinoReducer = ordinoSlice.reducer;
//# sourceMappingURL=ordinoSlice.js.map