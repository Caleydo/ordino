import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrdinoAppState, IWorkbench } from './interfaces';
import { viewsReducers } from './viewsReducer';
import { workbenchReducers } from './workbenchReducer';

const initialState: IOrdinoAppState = {
  workbenches: [],
  focusWorkbenchIndex: 0,
  colorMap: {},
  globalQuery: {
    filter: {
      col: 'species',
      op: 'IN',
      val: ['mouse', 'human'],
    },
    id: 'species',
    name: 'Species',
  },
};

const ordinoSlice = createSlice({
  name: 'ordino',
  initialState,
  reducers: {
    ...viewsReducers,
    ...workbenchReducers,
    // TODO in general: does it make sense to group the reducer functions (e.g., by workbench, views, ...)? or even create multiple variables that are spread-in here.

    setColorMap(state, action: PayloadAction<{ colorMap: { [key: string]: string } }>) {
      state.colorMap = action.payload.colorMap;
    },
    addEntityFormatting(state, action: PayloadAction<{ workbenchIndex: number; formatting: IWorkbench['formatting'] }>) {
      const { workbenchIndex, formatting } = action.payload;
      state.workbenches[workbenchIndex].formatting = formatting;
    },
    changeFocus(state, action: PayloadAction<{ index: number }>) {
      state.focusWorkbenchIndex = action.payload.index;
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
  removeWorkbench,
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
