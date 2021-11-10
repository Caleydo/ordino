import { IWorkbenchView } from '../../store';
export interface IWorkbenchViewsProps {
    currentView: IWorkbenchView;
}
export declare function WorkbenchViews({ currentView }: IWorkbenchViewsProps): JSX.Element;
