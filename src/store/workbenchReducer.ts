import { PayloadAction } from '@reduxjs/toolkit';
import { IColumnDesc } from 'lineupjs';
import { IRow } from 'tdp_core';
import { EWorkbenchDirection, ISelectedMapping, IWorkbench } from './interfaces';

export const workbenchReducers = {
  addFirstWorkbench(
    state,
    action: PayloadAction<{
      workbench: IWorkbench;
      globalQueryName: string;
      globalQueryCategories: string[];
      appliedQueryCategories: string[];
    }>,
  ) {
    state.focusWorkbenchIndex = 0;
    state.workbenches = [action.payload.workbench];
    state.globalQueryName = action.payload.globalQueryName;
    state.appliedQueryCategories = action.payload.appliedQueryCategories;
  },
  addWorkbench(state, action: PayloadAction<IWorkbench>) {
    if (state.workbenches.length > action.payload.index) {
      state.workbenches.splice(action.payload.index);
    }
    state.workbenches.push(action.payload);
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
  createColumnDescs(state, action: PayloadAction<{ workbenchIndex: number; desc: any }>) {
    const { workbenchIndex, desc } = action.payload;
    state.workbenches[workbenchIndex].columnDescs = desc;
  },
  addColumnDesc(state, action: PayloadAction<{ workbenchIndex: number; desc: any }>) {
    const { workbenchIndex } = action.payload;
    state.workbenches[workbenchIndex].columnDescs.push(action.payload.desc);
  },
  setWorkbenchDirection(state, action: PayloadAction<{ workbenchIndex: number; direction: EWorkbenchDirection }>) {
    state.workbenches[action.payload.workbenchIndex].viewDirection = action.payload.direction;
  },
  removeWorkbench(state, action: PayloadAction<{ index: number }>) {
    state.workbenches.splice(action.payload.index, state.workbenches.length);
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
  setCommentsOpen(state, action: PayloadAction<{ workbenchIndex: number; isOpen: boolean }>) {
    const { workbenchIndex, isOpen } = action.payload;
    state.workbenches[workbenchIndex].commentsOpen = isOpen;
  },
};
