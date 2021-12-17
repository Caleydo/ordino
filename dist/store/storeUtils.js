export function getAllFilters(workbench) {
    console.log(workbench);
    const allFilteredIds = new Set();
    workbench.views.forEach((f) => {
        f.filters.forEach((id) => {
            allFilteredIds.add(id);
        });
    });
    console.log(workbench);
    console.log(allFilteredIds);
    return Array.from(allFilteredIds);
}
//# sourceMappingURL=storeUtils.js.map