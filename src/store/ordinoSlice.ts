import { createSlice } from "@reduxjs/toolkit";
import { IViewPluginDesc } from "tdp_core";

export interface IOrdinoAppState {
  /**
   * List of open views
   */
  views: IOrdinoViewPluginDesc[];

  /**
   * Id of the current focus view
   */
  focusViewIndex: number;

  /**
   * Id of the previous focus view. Used for animations between views.
   * This needs to be changed. Doesnt work at all for Provenance
   */
  previousFocusIndex: number;
}

// Make this generic to support multiple types of views
// rename to IOrdinoViewPlugin, store the state of the view
export interface IOrdinoViewPluginDesc extends Omit<IViewPluginDesc, "load" | "preview"> {
  index: number;

  /**
   * List selected rows
   */
  selections?: any[]; // TODO define selection, probably IROW

  /**
   * Selected filters in this view
   */
  filters?: any[]; // TODO define filter
}

interface IBaseState {
  selection: string[];
}

export interface IOrdinoViewPlugin<S extends IBaseState> extends IViewPluginDesc {
  state: S;
}

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

const initialState: IOrdinoAppState = {
  views: [
    {
      id: "view_0",
      index: 0,
      name: "Start view",
      selection: "multiple",
      group: {
        name: "General",
        order: 10
      }
    }
  ],
  focusViewIndex: 0,
  previousFocusIndex: 0
};

const ordinoSlice = createSlice({
  name: "ordino",
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
