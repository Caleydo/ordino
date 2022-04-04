import { IWorkbench } from '../../../store';
export interface ICreateNextWorkbenchSidebarProps {
    workbench: IWorkbench;
}
export interface IMappingDesc {
    targetEntity: string;
    mappingEntity: string;
    mappingSubtype: string;
}
export declare function CreateNextWorkbenchSidebar({ workbench }: ICreateNextWorkbenchSidebarProps): JSX.Element;
//# sourceMappingURL=CreateNextWorkbenchSidebar.d.ts.map