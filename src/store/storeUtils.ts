import { IWorkbench } from './interfaces';
import { store } from './store';

export function getAllFilters(workbench: IWorkbench) {
  return Array.from(new Set(workbench.views.map((v) => v.filters).flat()));
}

export function findViewIndex(uniqueId: string, workbench: IWorkbench): number {
  return workbench.views.findIndex((v) => v.uniqueId === uniqueId);
}

export function isFirstWorkbench(workbench: IWorkbench): boolean {
  return workbench.index === 0;
}

export function isFocusWorkbench(workbench: IWorkbench): boolean {
  const state = store.getState();
  return workbench.index === state.ordinoTracked.focusWorkbenchIndex;
}

export function isBeforeContextWorkbench(workbench: IWorkbench): boolean {
  const state = store.getState();
  return workbench.index < state.ordinoTracked.focusWorkbenchIndex - 1;
}

export function isContextWorkbench(workbench: IWorkbench): boolean {
  const state = store.getState();
  return workbench.index === state.ordinoTracked.focusWorkbenchIndex - 1;
}

export function isNextWorkbench(workbench: IWorkbench): boolean {
  const state = store.getState();
  return workbench.index === state.ordinoTracked.focusWorkbenchIndex + 1;
}
