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
            selections: [],
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
            state.views.splice(action.payload.index, state.views.length - action.payload.index);
            state.views.push(action.payload);
        },
        addSelection(state, action) {
            state.views[action.payload.index].selections = action.payload.newSelection;
        },
        addFilter(state, action) {
            state.views[action.payload.index].filters.push(action.payload.newFilter);
        },
        changeFocus(state, action) {
            state.focusViewIndex = action.payload.index;
        },
        setActiveTab(state, action) {
            state.activeTab = action.payload.activeTab;
        },
        changeOffsetLeft(state, action) {
            state.views[action.payload.index].offsetLeft = action.payload.offsetLeft;
        }
    }
});
export const { addView, removeView, replaceView, addSelection, addFilter, setActiveTab, changeFocus, changeOffsetLeft } = ordinoSlice.actions;
export const ordinoReducer = ordinoSlice.reducer;
//# sourceMappingURL=ordinoSlice.js.map