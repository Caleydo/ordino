import { PayloadAction } from '@reduxjs/toolkit';
import { IColumnDesc } from 'lineupjs';
import { ISelectedMapping, IWorkbench } from './interfaces';

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
    state.globalQueryCategories = action.payload.globalQueryCategories;
    state.appliedQueryCategories = action.payload.appliedQueryCategories;
    state.midTransition = false;
  },
  addWorkbench(state, action: PayloadAction<IWorkbench>) {
    state.midTransition = true;
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
};
