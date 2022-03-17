import { IWorkbench } from '../../../store';
export interface IAddWorkbenchSidebarProps {
    workbench: IWorkbench;
}
export interface IMappingDesc {
    targetEntity: string;
    mappingEntity: string;
    mappingSubtype: string;
}
export declare function AddWorkbenchSidebar({ workbench }: IAddWorkbenchSidebarProps): JSX.Element;
//# sourceMappingURL=AddWorkbenchSidebar.d.ts.map