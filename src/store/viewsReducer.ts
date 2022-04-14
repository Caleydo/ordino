import { PayloadAction } from '@reduxjs/toolkit';
import { IWorkbenchView } from './interfaces';

export const viewsReducers = {
  addView(state, action: PayloadAction<{ workbenchIndex: number; view: IWorkbenchView }>) {
    state.workbenches[action.payload.workbenchIndex].views.push(action.payload.view);
  },
  setViewParameters(state, action: PayloadAction<{ workbenchIndex: number; viewIndex: number; parameters: any }>) {
    state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].parameters = action.payload.parameters;
  },
  setView(state, action: PayloadAction<{ workbenchIndex: number; viewIndex: number; viewId: string; viewName: string }>) {
    state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].id = action.payload.viewId;
    state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].name = action.payload.viewName;
  },
  switchViews(state, action: PayloadAction<{ workbenchIndex: number; firstViewIndex: number; secondViewIndex: number }>) {
    const temp: IWorkbenchView = state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex];

    state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex] =
      state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex];

    state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex] = temp;
  },
  removeView(state, action: PayloadAction<{ workbenchIndex: number; viewIndex: number }>) {
    const workbench = state.workbenches[action.payload.workbenchIndex];
    workbench.views.splice(action.payload.viewIndex, 1);
  },
};
