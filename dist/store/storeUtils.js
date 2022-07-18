import { store } from './store';
export function getAllFilters(workbench) {
    return Array.from(new Set(workbench.views.map((v) => v.filters).flat()));
}
export function findViewIndex(uniqueId, workbench) {
    return workbench.views.findIndex((v) => v.uniqueId === uniqueId);
}
export function isFirstWorkbench(workbench) {
    return workbench.index === 0;
}
export function isFocusWorkbench(workbench) {
    const state = store.getState();
    return workbench.index === state.ordino.focusWorkbenchIndex;
}
export function isBeforeContextWorkbench(workbench) {
    const state = store.getState();
    return workbench.index < state.ordino.focusWorkbenchIndex - 1;
}
export function isContextWorkbench(workbench) {
    const state = store.getState();
    return workbench.index === state.ordino.focusWorkbenchIndex - 1;
}
export function isNextWorkbench(workbench) {
    const state = store.getState();
    return workbench.index === state.ordino.focusWorkbenchIndex + 1;
}
//# sourceMappingURL=storeUtils.js.map