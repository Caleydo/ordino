import { IWorkbenchView } from '../../store';
export interface IWorkbenchSingleViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
}
export declare function getVisynView(entityId: string): Promise<import("tdp_core").IDiscoveredView[]>;
export declare function WorkbenchSingleView({ workbenchIndex, view }: IWorkbenchSingleViewProps): JSX.Element;
