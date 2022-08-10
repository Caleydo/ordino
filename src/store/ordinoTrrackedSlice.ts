import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { createTrrackableSlice } from '@trrack/redux';
import { IColumnDesc } from 'lineupjs';
import { IRow } from 'tdp_core';

import { IOrdinoAppTrackedState, IWorkbench } from './interfaces';
import { viewsReducers } from './viewsReducer';
import { workbenchReducers } from './workbenchReducer';

const initialState: IOrdinoAppTrackedState = {
  workbenches: [],
  focusWorkbenchIndex: 0,
  midTransition: false,
  colorMap: {},
};

export const createColumnDescs = createAction<{ workbenchIndex: number; desc: any }>('createColumnDescs');
export const setWorkbenchData = createAction<{ workbenchIndex: number; data: IRow[] }>('setWorkbenchData')
export const addScoreColumn = createAction<{ workbenchIndex: number; desc: IColumnDesc & { [key: string]: any }; data: any[] }>('addScoreColumn');
export const changeFocus = createAction<{ index: number }>('changeFocus');

export const ordinoTrrackedSlice = createTrrackableSlice({
  name: 'ordino',
  initialState,
  reducers: {
    ...viewsReducers,
    ...workbenchReducers,
    // TODO in general: does it make sense to group the reducer functions (e.g., by workbench, views, ...)? or even create multiple variables that are spread-in here.


    addEntityFormatting(state, action: PayloadAction<{ workbenchIndex: number; formatting: IWorkbench['formatting'] }>) {
      const { workbenchIndex, formatting } = action.payload;
      state.workbenches[workbenchIndex].formatting = formatting;
    },
    setDetailsSidebarOpen(state, action: PayloadAction<{ workbenchIndex: number; open: boolean }>) {
      state.workbenches[action.payload.workbenchIndex].detailsSidebarOpen = action.payload.open;
    },
    // createColumnDescs(state, action: PayloadAction<{ workbenchIndex: number; desc: any }>) {
    //   const { workbenchIndex, desc } = action.payload;
    //   state.workbenches[workbenchIndex].columnDescs = desc;
    // },
    addColumnDesc(state, action: PayloadAction<{ workbenchIndex: number; desc: any }>) {
      const { workbenchIndex } = action.payload;
      state.workbenches[workbenchIndex].columnDescs.push(action.payload.desc);
    },
    // setWorkbenchData(state, action: PayloadAction<{ workbenchIndex: number; data: IRow[] }>) {
    //   const { workbenchIndex, data } = action.payload;
    //   for (const row of data) {
    //     state.workbenches[workbenchIndex].data[row.id] = row;
    //   }
    // },
    setColorMap(state, action: PayloadAction<{ colorMap: { [key: string]: string } }>) {
      state.colorMap = action.payload.colorMap;
    },

    setTransition(state, action: PayloadAction<boolean>) {
      state.midTransition = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(createColumnDescs, (state, action: PayloadAction<{ workbenchIndex: number; desc: any }>) {
      const { workbenchIndex, desc } = action.payload;
      state.workbenches[workbenchIndex].columnDescs = desc;
    }).addCase(setWorkbenchData, (state, action: PayloadAction<{ workbenchIndex: number; data: IRow[] }>) {
      const { workbenchIndex, data } = action.payload;
      for (const row of data) {
        state.workbenches[workbenchIndex].data[row.id] = row;
      }
    }).addCase(addScoreColumn, (state, action: PayloadAction<{ workbenchIndex: number; desc: IColumnDesc & { [key: string]: any }; data: any[] }>) {
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
    }).addCase(changeFocus, (state, action: PayloadAction<{ index: number }>) {
      state.focusWorkbenchIndex = action.payload.index;
      state.midTransition = false;
    },)
  },
});



export const {
  setColorMap,
  setDetailsSidebarOpen,
  addColumnDesc,
  addView,
  changeSelectedMappings,
  setViewParameters,
  addEntityFormatting,
  setView,
  removeView,
  replaceWorkbench,
  removeWorkbench,
  addSelection,
  addFilter,
  addFirstWorkbench,
  addWorkbench,
  switchViews,
  setTransition,
} = ordinoTrrackedSlice.actions;

export * from './ordinoUntrackedSlice';

export const ordinoTrrackedReducer = ordinoTrrackedSlice.reducer;
