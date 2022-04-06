import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRow, IViewPluginDesc } from 'tdp_core';
import { IColumnDesc } from 'lineupjs';

export enum EViewDirections {
  N = 'n',
  S = 's',
  W = 'w',
  E = 'e',
}

export interface IWorkbenchView {
  // this id is used to load the view from the view plugin. It is not unique.
  id: string;
  // this id is generated on creation and is simply a unique value used to differentiate views that may have the same id.
  uniqueId: string;
  name: string;
  filters: string[];
  parameters?: any;
}

export interface IOrdinoAppState {
  /**
   * List of open views.
   */
  workbenches: IWorkbench[];

  colorMap: { [key: string]: string };

  /**
   * Id of the current focus view
   */
  focusViewIndex: number;
  sidebarOpen: boolean;
}

export enum EWorkbenchDirection {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export interface ISelectedMapping {
  entityId: string;
  columnSelection: string;
}

export interface IWorkbench {
  /**
   * List of open views. The order of the views in this list determines the order they are displayed in the workbench.
   */
  views: IWorkbenchView[];

  selectedMappings: ISelectedMapping[];

  viewDirection: EWorkbenchDirection;

  name: string;
  /**
   * itemIDType of the views in a workbench, should match the itemIDType of the default ranking
   */
  itemIDType: string;
  entityId: string;

  index: number;

  data: { [key: string]: IRow };
  columnDescs: (IColumnDesc & { [key: string]: any })[];
  // TODO: how do we store the lineup-specific column descriptions?

  transitionOptions: IRow['_visyn_id'][];

  /**
   * List selected rows
   */
  selection: IRow['_visyn_id'][];

  detailsOpen: boolean;
  addWorkbenchOpen: boolean;
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

const containsView = (workbench: IWorkbench, viewId: string) => workbench.views.some(({ uniqueId }) => uniqueId === viewId);

const initialState: IOrdinoAppState = {
  workbenches: [],
  focusViewIndex: 0,
  sidebarOpen: false,
  colorMap: {},
};

// TODO: Change rest of methods to use viewId instead of entity id
const ordinoSlice = createSlice({
  name: 'ordino',
  initialState,
  reducers: {
    addFirstWorkbench(state, action: PayloadAction<IWorkbench>) {
      state.focusViewIndex = 0;
      state.workbenches.splice(0, state.workbenches.length);
      state.workbenches.push(action.payload);
    },
    createColorMap(state, action: PayloadAction<{ colorMap: { [key: string]: string } }>) {
      state.colorMap = action.payload.colorMap;
    },
    addWorkbench(state, action: PayloadAction<IWorkbench>) {
      if (state.workbenches.length > action.payload.index) {
        state.workbenches.splice(action.payload.index);
      }
      state.workbenches.push(action.payload);
    },
    addView(state, action: PayloadAction<{ workbenchIndex: number; view: IWorkbenchView }>) {
      state.workbenches[action.payload.workbenchIndex].views.push(action.payload.view);
    },
    setSidebarOpen(state, action: PayloadAction<{ open: boolean }>) {
      state.sidebarOpen = action.payload.open;
    },
    setViewParameters(state, action: PayloadAction<{ workbenchIndex: number; viewIndex: number; parameters: any }>) {
      state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].parameters = action.payload.parameters;
    },
    changeSelectedMappings(state, action: PayloadAction<{ workbenchIndex: number; newMapping: ISelectedMapping }>) {
      if (
        !state.workbenches[action.payload.workbenchIndex].selectedMappings.find((m) => {
          return m.entityId === action.payload.newMapping.entityId && m.columnSelection === action.payload.newMapping.columnSelection;
        })
      ) {
        state.workbenches[action.payload.workbenchIndex].selectedMappings.push(action.payload.newMapping);
      } else {
        state.workbenches[action.payload.workbenchIndex].selectedMappings = state.workbenches[action.payload.workbenchIndex].selectedMappings.filter(
          (m) => !(m.entityId === action.payload.newMapping.entityId && m.columnSelection === action.payload.newMapping.columnSelection),
        );
      }
    },
    setDetailsOpen(state, action: PayloadAction<{ workbenchIndex: number; open: boolean }>) {
      state.workbenches[action.payload.workbenchIndex].detailsOpen = action.payload.open;
    },
    setAddWorkbenchOpen(state, action: PayloadAction<{ workbenchIndex: number; open: boolean }>) {
      state.workbenches[action.payload.workbenchIndex].addWorkbenchOpen = action.payload.open;
    },
    setView(state, action: PayloadAction<{ workbenchIndex: number; viewIndex: number; viewId: string; viewName: string }>) {
      state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].id = action.payload.viewId;
      state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].name = action.payload.viewName;
    },
    createColumnDescs(state, action: PayloadAction<{ workbenchIndex: number; desc: any }>) {
      const { workbenchIndex, desc } = action.payload;
      state.workbenches[workbenchIndex].columnDescs = desc;
    },

    addColumnDesc(state, action: PayloadAction<{ workbenchIndex: number; desc: any }>) {
      const { workbenchIndex, desc } = action.payload;
      state.workbenches[workbenchIndex].columnDescs.push(action.payload.desc);
    },
    switchViews(state, action: PayloadAction<{ workbenchIndex: number; firstViewIndex: number; secondViewIndex: number }>) {
      const temp: IWorkbenchView = state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex];

      state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex] =
        state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex];

      state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex] = temp;
    },
    setWorkbenchDirection(state, action: PayloadAction<{ workbenchIndex: number; direction: EWorkbenchDirection }>) {
      state.workbenches[action.payload.workbenchIndex].viewDirection = action.payload.direction;
    },
    removeWorkbench(state, action: PayloadAction<{ index: number }>) {
      state.workbenches.slice(action.payload.index);
    },
    // TODO:: When we remove the views jump too much. We need to do something smarter based on what the direction is to figure out where to move the still existing views.
    removeView(state, action: PayloadAction<{ workbenchIndex: number; viewIndex: number }>) {
      const workbench = state.workbenches[action.payload.workbenchIndex];
      workbench.views.splice(action.payload.viewIndex, 1);
    },
    replaceWorkbench(state, action: PayloadAction<{ workbenchIndex: number; newWorkbench: IWorkbench }>) {
      state.workbenches.splice(action.payload.workbenchIndex);
      state.workbenches.push(action.payload.newWorkbench);
    },
    addSelection(state, action: PayloadAction<{ workbenchIndex: number; newSelection: string[] }>) {
      const { workbenchIndex, newSelection } = action.payload;
      state.workbenches[workbenchIndex].selection = newSelection;
    },
    addFilter(state, action: PayloadAction<{ workbenchIndex: number; viewId: string; filter: string[] }>) {
      state.workbenches[action.payload.workbenchIndex].views.find((v) => v.uniqueId === action.payload.viewId).filters = action.payload.filter;
    },
    changeFocus(state, action: PayloadAction<{ index: number }>) {
      state.focusViewIndex = action.payload.index;
    },

    setWorkbenchData(state, action: PayloadAction<{ workbenchIndex: number; data: any[] }>) {
      const { workbenchIndex, data } = action.payload;
      for (const i of data) {
        state.workbenches[workbenchIndex].data[i.id] = i;
      }
    },

    addScoreColumn(state, action: PayloadAction<{ workbenchIndex: number; desc: IColumnDesc & { [key: string]: any }; data: any[] }>) {
      const { workbenchIndex, desc, data } = action.payload;
      state.workbenches[workbenchIndex].columnDescs.push(desc);
      for (const row of data) {
        const dataRow = state.workbenches[workbenchIndex].data[row.id];
        if (dataRow) {
          dataRow[desc.scoreID] = row.score;
        } // TODO: BUG the score should not add a new row when the id id does not exist in my current data else {
        //   state.workbenches[state.focusViewIndex].data[row.id] = row;
        // }
      }
    },
  },
});

export const {
  addView,
  createColorMap,
  changeSelectedMappings,
  setDetailsOpen,
  setAddWorkbenchOpen,
  setViewParameters,
  setSidebarOpen,
  createColumnDescs,
  setView,
  addColumnDesc,
  removeView,
  replaceWorkbench,
  addScoreColumn,
  addSelection,
  addFilter,
  setWorkbenchData,
  changeFocus,
  addFirstWorkbench,
  addWorkbench,
  switchViews,
  setWorkbenchDirection,
} = ordinoSlice.actions;

export const ordinoReducer = ordinoSlice.reducer;
