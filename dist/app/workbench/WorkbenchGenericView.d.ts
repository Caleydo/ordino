import { IWorkbenchView } from '../../store';
import { IViewPluginDesc } from 'tdp_core';
export interface IWorkbenchGenericViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
}
export declare function WorkbenchGenericView({ workbenchIndex, view, chooserOptions }: IWorkbenchGenericViewProps): JSX.Element;
