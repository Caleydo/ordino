import { PayloadAction } from '@reduxjs/toolkit';
import { createTrrackableSlice } from '@trrack/redux';
import { IRow } from 'tdp_core';

import { IOrdinoAppTrackedState, IWorkbench } from './interfaces';
import { viewsReducers } from './viewsReducer';
import { workbenchReducers } from './workbenchReducer';

const initialState: IOrdinoAppTrackedState = {
  workbenches: [],
  focusWorkbenchIndex: 0,
  midTransition: false,
  colorMap: {},
  isAnimating: false,
};

export const ordinoTrrackedSlice = createTrrackableSlice({
  name: 'ordino',
  initialState,
  reducers: {
    ...viewsReducers,
    ...workbenchReducers,
    // TODO in general: does it make sense to group the reducer functions (e.g., by workbench, views, ...)? or even create multiple variables that are spread-in here.

    changeFocus(state, action: PayloadAction<{ index: number }>) {
      state.focusWorkbenchIndex = action.payload.index;
      state.midTransition = false;
    },
    addEntityFormatting(state, action: PayloadAction<{ workbenchIndex: number; formatting: IWorkbench['formatting'] }>) {
      const { workbenchIndex, formatting } = action.payload;
      state.workbenches[workbenchIndex].formatting = formatting;
    },
    setDetailsSidebarOpen(state, action: PayloadAction<{ workbenchIndex: number; open: boolean }>) {
      state.workbenches[action.payload.workbenchIndex].detailsSidebarOpen = action.payload.open;
    },
    createColumnDescs(state, action: PayloadAction<{ workbenchIndex: number; desc: any }>) {
      const { workbenchIndex, desc } = action.payload;
      state.workbenches[workbenchIndex].columnDescs = desc;
    },
    addColumnDesc(state, action: PayloadAction<{ workbenchIndex: number; desc: any }>) {
      const { workbenchIndex } = action.payload;
      state.workbenches[workbenchIndex].columnDescs.push(action.payload.desc);
    },
    setWorkbenchData(state, action: PayloadAction<{ workbenchIndex: number; data: IRow[] }>) {
      const { workbenchIndex, data } = action.payload;
      for (const row of data) {
        state.workbenches[workbenchIndex].data[row.id] = row;
      }
    },
    setCommentsOpen(state, action: PayloadAction<{ workbenchIndex: number; isOpen: boolean }>) {
      const { workbenchIndex, isOpen } = action.payload;
      state.workbenches[workbenchIndex].commentsOpen = isOpen;
    },
    setColorMap(state, action: PayloadAction<{ colorMap: { [key: string]: string } }>) {
      state.colorMap = action.payload.colorMap;
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
  setColorMap,
  setTransition,
  setAnimating,
  setDetailsSidebarOpen,
  createColumnDescs,
  addColumnDesc,
  setWorkbenchData,
  setCommentsOpen,
  addView,
  changeSelectedMappings,
  setViewParameters,
  addEntityFormatting,
  setView,
  removeView,
  replaceWorkbench,
  removeWorkbench,
  addScoreColumn,
  addSelection,
  addFilter,
  changeFocus,
  addFirstWorkbench,
  addWorkbench,
  switchViews,
} = ordinoTrrackedSlice.actions;

export const ordinoTrrackedReducer = ordinoTrrackedSlice.reducer;
