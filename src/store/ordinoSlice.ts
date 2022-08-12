import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { intersection } from 'lodash';
import { IOrdinoAppState, IWorkbench } from './interfaces';
import { viewsReducers } from './viewsReducer';
import { workbenchReducers } from './workbenchReducer';

const initialState: IOrdinoAppState = {
  workbenches: [],
  focusWorkbenchIndex: 0,
  midTransition: false,
  colorMap: {},
  isAnimating: false,
  globalQueryName: '',
  globalQueryCategories: [],
  appliedQueryCategories: [],
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
    setGlobalFilters(state, action: PayloadAction<{ appliedQueryCategories: string[] }>) {
      const includesCurrentFilter =
        state.appliedQueryCategories?.length === intersection(state.appliedQueryCategories, action.payload.appliedQueryCategories)?.length ||
        action.payload.appliedQueryCategories?.length === 0; // if no filter is selected then the new data is a superset of the previous data

      if (!includesCurrentFilter) {
        // if the new filter does not include the previous, remove all workbenches except the first one
        if (state.workbenches.length > 1) {
          state.workbenches.length = 1;
          state.focusWorkbenchIndex = 0;
          state.midTransition = false;
          state.isAnimating = true;
        }
        state.workbenches[0].selection = []; // clear the selection
      }
      state.appliedQueryCategories = action.payload.appliedQueryCategories;
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
  setTransition,
  setAnimating,
  setGlobalFilters,
} = ordinoSlice.actions;

export const ordinoReducer = ordinoSlice.reducer;
