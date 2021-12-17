import {IWorkbench} from '.';

export function getAllFilters(workbench: IWorkbench) {
    const allFilteredIds: Set<number> = new Set<number>();
    workbench.views.forEach((f) => {
        f.filters.forEach((id) => {
            allFilteredIds.add(id);
        });
    });


    return Array.from(allFilteredIds);
}
