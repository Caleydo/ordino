import {IWorkbench} from '.';

export function getAllFilters(workbench: IWorkbench) {
    const allFilteredIds: string[] = [];
    workbench.views.forEach((f) => {
        f.filters.forEach((id) => {
            allFilteredIds.push(id);
        });
    });


    return Array.from(allFilteredIds);
}
