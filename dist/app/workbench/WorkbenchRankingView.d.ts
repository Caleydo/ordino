import { IViewPluginDesc } from 'tdp_core';
import { IWorkbenchView } from '../../store';
export interface IWorkbenchRankingViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
}
export declare function WorkbenchRankingView({ workbenchIndex, view, chooserOptions }: IWorkbenchRankingViewProps): JSX.Element;
