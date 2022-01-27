import { IWorkbenchView } from '../../store';
export interface IWorkbenchRankingViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
}
export declare function WorkbenchRankingView({ workbenchIndex, view }: IWorkbenchRankingViewProps): JSX.Element;
