export function getAllFilters(workbench) {
    const allFilteredIds = new Set();
    workbench.views.forEach((view) => {
        view.filters.forEach((id) => {
            allFilteredIds.add(id);
        });
    });
    return Array.from(allFilteredIds);
}
//# sourceMappingURL=storeUtils.js.map