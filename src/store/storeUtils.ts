import { IWorkbench } from './interfaces';

export function getAllFilters(workbench: IWorkbench) {
  return Array.from(new Set(workbench.views.map((v) => v.filters).flat()));
}

export function findViewIndex(uniqueId: string, workbench: IWorkbench): number {
  return workbench.views.findIndex((v) => v.uniqueId === uniqueId);
}
