import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IViewPluginDesc} from 'tdp_core';

export enum ETabStates {
  NONE = 'none',
  DATASETS = 'datasets',
  ANALYSIS = 'analysis',
  TOURS = 'tours'
}

export enum EViewDirections {
  N = 'n',
  S = 's',
  W = 'w',
  E = 'e'
}

export interface IWorkbenchView extends Omit<IViewPluginDesc, 'load' | 'preview'> {
  directionFromParent: EViewDirections;
  children: IWorkbenchView[];
}

export interface IOrdinoAppState {
  /**
   * List of open views. TODO: This should be changed to "workbenches" probably
   */
  workbenches: IWorkbench[];

  /**
   * Id of the current focus view
   */
  focusViewIndex: number;

  activeTab: ETabStates;
}

export interface IWorkbench {
  /**
   * List of open views.
   */
  startingView: IWorkbenchView;

  name: string;

  id: string;

  index: number;

  /**
   * List selected rows
   */
  selections: any[]; // TODO define selection, probably IROW

  /**
   * Selected filters in this view
   */
  filters: any[]; // TODO define filter
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
  workbenches:
  [{
    index: 0,
    startingView:
    {
      directionFromParent: EViewDirections.E,
      children: [],
      id: 'view_0',
      index: 0,
      name: 'Start view',
      selection: 'multiple',
      selections: [],
      group: {
        name: 'General',
        order: 10
      }
    },
    name: 'Start View',
    id: 'startView',
    selections: [],
    filters: []
  }],
  focusViewIndex: 0,
  activeTab: ETabStates.NONE
};

function getNode(id: string, currNode: IWorkbenchView) {
  if(currNode.id === id) {
    return currNode;
  }

  let result: IWorkbenchView = null;

  if(currNode.children.length > 0) {
    for(let i = 0; result == null && i < currNode.children.length; i++) {
      result = getNode(id, currNode.children[i]);
    }

    return result;
  } else {
    return null;
  }
}

const ordinoSlice = createSlice({
  name: 'ordino',
  initialState,
  reducers: {
    addWorkbench(state, action: PayloadAction<IWorkbench>) {
      state.workbenches.push(action.payload);
    },
    addView(state, action: PayloadAction<{workbenchId: number, parentId: string, direction: EViewDirections, view: IWorkbenchView}>) {
      const parentView = getNode(action.payload.parentId, state.workbenches[action.payload.workbenchId].startingView);

      parentView.children.push(action.payload.view);
    },
    removeWorkbench(state, action: PayloadAction<{index: number}>) {
      state.workbenches.slice(action.payload.index);
    },
    removeView(state, action: PayloadAction<{workbenchIndex: number, viewIndex: number}>) {
      // state.workbenches[action.payload.workbenchIndex].views.slice(action.payload.viewIndex);
    },
    replaceWorkbench(state, action: PayloadAction<{workbenchIndex: number, newWorkbench: IWorkbench}>) {
      state.workbenches.splice(action.payload.workbenchIndex);
      state.workbenches.push(action.payload.newWorkbench);
    },
    addSelection(state, action: PayloadAction<{workbenchIndex: number, viewIndex: number, newSelection: any}>) {
      // state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].selections = action.payload.newSelection;
    },
    addFilter(state, action: PayloadAction<{workbenchIndex: number, viewIndex: number, newFilter: any}>) {
      // state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].filters.push(action.payload.newFilter);
    },
    changeFocus(state, action: PayloadAction<{index: number}>) {
      state.focusViewIndex = action.payload.index;
    },
    setActiveTab(state, action: PayloadAction<{activeTab: ETabStates}>) {
      state.activeTab = action.payload.activeTab;
    }
  }
});

export const { addView, removeView, replaceWorkbench, addSelection, addFilter, setActiveTab, changeFocus, addWorkbench } = ordinoSlice.actions;

export const ordinoReducer = ordinoSlice.reducer;
