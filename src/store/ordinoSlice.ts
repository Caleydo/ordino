import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IViewPluginDesc} from 'tdp_core';


export enum EViewDirections {
  N = 'n',
  S = 's',
  W = 'w',
  E = 'e'
}

export interface IWorkbenchView extends Omit<IViewPluginDesc, 'load' | 'preview'> {

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

}

export interface IWorkbench {
  /**
   * List of open views.
   */
  views: IWorkbenchView[];

  viewDirection: 'vertical' | 'horizontal';

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
  workbenches: [],
  focusViewIndex: 0,
};

const ordinoSlice = createSlice({
  name: 'ordino',
  initialState,
  reducers: {
    addFirstWorkbench(state, action: PayloadAction<IWorkbench>) {
      state.workbenches.splice(0, state.workbenches.length);
      state.workbenches.push(action.payload);
    },
    addWorkbench(state, action: PayloadAction<IWorkbench>) {
      state.workbenches.push(action.payload);
    },
    addView(state, action: PayloadAction<{workbenchIndex: number, view: IWorkbenchView}>) {
      state.workbenches[action.payload.workbenchIndex].views.push(action.payload.view);
    },
    switchViews(state, action: PayloadAction<{workbenchIndex: number, firstViewIndex: number, secondViewIndex: number}>) {
      console.log(action.payload.firstViewIndex, action.payload.secondViewIndex);

      const temp: IWorkbenchView = state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex];

      temp.index = action.payload.secondViewIndex;

      state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex] = state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex];
      state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex].index = action.payload.firstViewIndex;

      state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex] = temp;
    },
    setWorkbenchDirection(state, action: PayloadAction<{workbenchIndex: number, direction: 'vertical' | 'horizontal'}>) {
      state.workbenches[action.payload.workbenchIndex].viewDirection = action.payload.direction;
    },
    removeWorkbench(state, action: PayloadAction<{index: number}>) {
      state.workbenches.slice(action.payload.index);
    },
    //TODO:: When we remove the views jump too much. We need to do something smarter based on what the direction is to figure out where to move the still existing views.
    removeView(state, action: PayloadAction<{workbenchIndex: number, viewIndex: number}>) {
      const workbench = state.workbenches[action.payload.workbenchIndex];
      workbench.views.splice(action.payload.viewIndex, 1);

      for (let j = 0; j < workbench.views.length; j++) {
        workbench.views[j].index = j;
      }
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
    }
  }
});

export const {addView, removeView, replaceWorkbench, addSelection, addFilter, changeFocus, addFirstWorkbench, addWorkbench, switchViews, setWorkbenchDirection} = ordinoSlice.actions;

export const ordinoReducer = ordinoSlice.reducer;
