export function getAllFilters(workbench) {
    const allFilteredIds = new Set();
    workbench.views.forEach((f) => {
        f.filters.forEach((id) => {
            allFilteredIds.add(id);
        });
    });
    return Array.from(allFilteredIds);
}
export function findViewIndex(uniqueId, workbench) {
    return workbench.views.findIndex((v) => v.uniqueId === uniqueId);
}
//# sourceMappingURL=storeUtils.js.map