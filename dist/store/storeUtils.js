export function getAllFilters(workbench) {
    const allFilteredIds = new Set();
    workbench.views.forEach((f) => {
        f.filters.forEach((id) => {
            allFilteredIds.add(id);
        });
    });
    return Array.from(allFilteredIds);
}
//# sourceMappingURL=storeUtils.js.map