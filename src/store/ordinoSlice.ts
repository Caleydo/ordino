import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrdinoAppState, IWorkbench } from './interfaces';
import { viewsReducers } from './viewsReducer';
import { workbenchReducers } from './workbenchReducer';

const initialState: IOrdinoAppState = {
  workbenches: [],
  focusWorkbenchIndex: 0,
  midTransition: false,
  colorMap: {},
  isAnimating: false,
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
      state.midTransition = false;
      state.isAnimating = true;
    },
    setTransition(state, action: PayloadAction<boolean>) {
      state.midTransition = action.payload;
    },
    setAnimating(state, action: PayloadAction<boolean>) {
      state.isAnimating = action.payload;
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
  setTransition,
  setAnimating,
} = ordinoSlice.actions;

export const ordinoReducer = ordinoSlice.reducer;
