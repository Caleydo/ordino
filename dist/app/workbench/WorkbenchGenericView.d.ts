import { IWorkbenchView } from '../../store';
export interface IWorkbenchGenericViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
}
export declare function WorkbenchGenericView({ workbenchIndex, view }: IWorkbenchGenericViewProps): JSX.Element;
