import {createSlice} from '@reduxjs/toolkit';
import {IViewPluginDesc} from 'tdp_core';

export enum ETabStates {
  NONE = 'none',
  DATASETS = 'datasets',
  ANALYSIS = 'analysis',
  TOURS = 'tours'
}

export interface IOrdinoAppState {
  /**
   * List of open views
   */
  views: IOrdinoViewPluginDesc[];

  /**
   * Id of the current focus view
   */
  focusViewIndex: number;

  activeTab: ETabStates;
}

// Make this generic to support multiple types of views
// rename to IOrdinoViewPlugin, store the state of the view
export interface IOrdinoViewPluginDesc extends Omit<IViewPluginDesc, 'load' | 'preview'> {
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
      state.views.splice(action.payload.index);
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
    }
  }
});

export const { addView, removeView, replaceView, addSelection, addFilter, setActiveTab, changeFocus } = ordinoSlice.actions;

export const ordinoReducer = ordinoSlice.reducer;
