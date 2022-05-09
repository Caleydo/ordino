export function getAllFilters(workbench) {
    return Array.from(new Set(workbench.views.map((v) => v.filters).flat()));
}
export function findViewIndex(uniqueId, workbench) {
    return workbench.views.findIndex((v) => v.uniqueId === uniqueId);
}
//# sourceMappingURL=storeUtils.js.map