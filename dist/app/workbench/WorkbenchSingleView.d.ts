import { IWorkbenchView } from '../../store';
export interface IWorkbenchSingleViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
}
export declare function WorkbenchSingleView({ workbenchIndex, view }: IWorkbenchSingleViewProps): JSX.Element;
