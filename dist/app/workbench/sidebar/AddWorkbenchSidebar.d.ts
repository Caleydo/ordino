import { IWorkbench } from '../../../store';
export interface IWorkbenchSidebarProps {
    workbench: IWorkbench;
}
export interface IMappingDesc {
    targetEntity: string;
    mappingEntity: string;
    mappingSubtype: string;
}
export declare function AddWorkbenchSidebar({ workbench }: IWorkbenchSidebarProps): JSX.Element;
//# sourceMappingURL=AddWorkbenchSidebar.d.ts.map