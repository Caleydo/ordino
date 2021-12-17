import {IWorkbench} from '.';

export function getAllFilters(workbench: IWorkbench) {
    console.log(workbench);
    const allFilteredIds: Set<number> = new Set<number>();
    workbench.views.forEach((f) => {
        f.filters.forEach((id) => {
            allFilteredIds.add(id);
        });
    });

    console.log(workbench);
    console.log(allFilteredIds);

    return Array.from(allFilteredIds);
}
