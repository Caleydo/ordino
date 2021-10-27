import { createSlice } from '@reduxjs/toolkit';
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
    previousFocusIndex: 0
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
        changeFocus(state, action) {
            state.previousFocusIndex = state.focusViewIndex;
            state.focusViewIndex = action.payload.index;
        }
    }
});
export const { addView, removeView, replaceView, addSelection, addFilter, changeFocus } = ordinoSlice.actions;
export const ordinoReducer = ordinoSlice.reducer;
//# sourceMappingURL=ordinoSlice.js.map