export function getAllFilters(workbench) {
    const allFilteredIds = [];
    workbench.views.forEach((f) => {
        f.filters.forEach((id) => {
            allFilteredIds.push(id);
        });
    });
    return Array.from(allFilteredIds);
}
//# sourceMappingURL=storeUtils.js.map