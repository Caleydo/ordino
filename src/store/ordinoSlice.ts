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

  /**
   * Map for the colors which are assigned to each entity. Derived from the config file.
   * Keys are the entity id matching IWorkbench.entityId.
   * Values are any typical string representation of a color.
   */
  colorMap: { [key: string]: string };

  /**
   * Id of the current focus view
   */
  focusWorkbenchIndex: number;
}

export enum EWorkbenchDirection {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

/**
 * entityId is equivalent to IWorkbench.entityId
 * columnSelection is a mapping subtype, such as "relativecopynumber"
 */
export interface ISelectedMapping {
  entityId: string;
  columnSelection: string;
}

export interface IWorkbench {
  /**
   * List of open views. The order of the views in this list determines the order they are displayed in the workbench.
   */
  views: IWorkbenchView[];

  /**
   * List of selected mappings which are passed to the next workbench when created. Description of ISelectedMapping interface above.
   */
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
  // TODO: how do we store the lineup-specific column descriptions? give an example?

  /**
   * List selected rows
   */
  selection: IRow['_visyn_id'][];

  formatting?: {
    titleColumn?: string;
    idColumn: string;
    formatResult?: string;
    tokenSeparatorsRegex?: string;
    defaultTokenSeparator?: string;
  };

  /**
   * "detailsSidebar" is the information about the incoming selection of a workbench. It is a panel on the left side of a workbench, openable via burger menu.
   * Since the first workbench does not have an incoming selection, this is always false for the first workbench
   * detailsSidebarOpen keeps track of whether or not the details tab is switched open.
   */
  detailsSidebarOpen: boolean;

  /**
   * "createNextWorkbenchSidebar" is the sidebar that appears to the right of a workbench when you want to add a new workbench.
   * It contains options for which mapping types you want in the next workbench.
   * createNextWorkbenchSidebarOpen keeps track of whether or not the details tab is switched open
   */
  createNextWorkbenchSidebarOpen: boolean;

  commentsOpen?: boolean;
}

interface IBaseState {
  selection: string[];
}

export interface IOrdinoViewPlugin<S extends IBaseState> extends IViewPluginDesc {
  state: S;
}

const initialState: IOrdinoAppState = {
  workbenches: [],
  focusWorkbenchIndex: 0,
  colorMap: {},
};

const ordinoSlice = createSlice({
  name: 'ordino',
  initialState,
  reducers: {
    // TODO in general: does it make sense to group the reducer functions (e.g., by workbench, views, ...)? or even create multiple variables that are spread-in here.

    addFirstWorkbench(state, action: PayloadAction<IWorkbench>) {
      state.focusWorkbenchIndex = 0;
      state.workbenches.splice(0, state.workbenches.length);
      state.workbenches.push(action.payload);
    },
    setColorMap(state, action: PayloadAction<{ colorMap: { [key: string]: string } }>) {
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
    setViewParameters(state, action: PayloadAction<{ workbenchIndex: number; viewIndex: number; parameters: any }>) {
      state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].parameters = action.payload.parameters;
    },
    changeSelectedMappings(state, action: PayloadAction<{ workbenchIndex: number; newMapping: ISelectedMapping }>) {
      const currentWorkbench = state.workbenches[action.payload.workbenchIndex];

      const { newMapping } = action.payload;
      if (
        !currentWorkbench.selectedMappings.find((m) => {
          const { entityId, columnSelection } = newMapping;
          return m.entityId === entityId && m.columnSelection === columnSelection;
        })
      ) {
        currentWorkbench.selectedMappings.push(newMapping);
      } else {
        currentWorkbench.selectedMappings = currentWorkbench.selectedMappings.filter((m) => {
          const { entityId, columnSelection } = newMapping;
          return !(m.entityId === entityId && m.columnSelection === columnSelection);
        });
      }
    },
    setDetailsSidebarOpen(state, action: PayloadAction<{ workbenchIndex: number; open: boolean }>) {
      state.workbenches[action.payload.workbenchIndex].detailsSidebarOpen = action.payload.open;
    },
    setCreateNextWorkbenchSidebarOpen(state, action: PayloadAction<{ workbenchIndex: number; open: boolean }>) {
      state.workbenches[action.payload.workbenchIndex].createNextWorkbenchSidebarOpen = action.payload.open;
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
      const { workbenchIndex } = action.payload;
      state.workbenches[workbenchIndex].columnDescs.push(action.payload.desc);
    },

    addEntityFormatting(state, action: PayloadAction<{ workbenchIndex: number; formatting: IWorkbench['formatting'] }>) {
      const { workbenchIndex, formatting } = action.payload;
      state.workbenches[workbenchIndex].formatting = formatting;
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
      state.focusWorkbenchIndex = action.payload.index;
    },

    setWorkbenchData(state, action: PayloadAction<{ workbenchIndex: number; data: IRow[] }>) {
      const { workbenchIndex, data } = action.payload;
      for (const row of data) {
        state.workbenches[workbenchIndex].data[row.id] = row;
      }
    },

    addScoreColumn(state, action: PayloadAction<{ workbenchIndex: number; desc: IColumnDesc & { [key: string]: any }; data: any[] }>) {
      const { workbenchIndex, desc, data } = action.payload;
      state.workbenches[workbenchIndex].columnDescs.push(desc);
      for (const row of data) {
        const dataRow = state.workbenches[workbenchIndex].data[row.id];
        if (dataRow) {
          dataRow[desc.scoreID] = row.score;
        } // TODO: BUG the score should not add a new row when the id does not exist in my current data else {
        //   state.workbenches[state.focusViewIndex].data[row.id] = row;
        // }
      }
    },
    setCommentsOpen(state, action: PayloadAction<{ workbenchIndex: number; open: boolean }>) {
      const { workbenchIndex, open } = action.payload;
      state.workbenches[workbenchIndex].commentsOpen = open;
    },
  },
});

export const {
  addView,
  setColorMap,
  changeSelectedMappings,
  setDetailsSidebarOpen,
  setCreateNextWorkbenchSidebarOpen,
  setViewParameters,
  createColumnDescs,
  setView,
  addColumnDesc,
  removeView,
  replaceWorkbench,
  addEntityFormatting,
  addScoreColumn,
  addSelection,
  addFilter,
  setWorkbenchData,
  changeFocus,
  addFirstWorkbench,
  addWorkbench,
  switchViews,
  setWorkbenchDirection,
  setCommentsOpen,
} = ordinoSlice.actions;

export const ordinoReducer = ordinoSlice.reducer;
