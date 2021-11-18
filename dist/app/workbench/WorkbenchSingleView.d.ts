/// <reference types="react" />
import { IWorkbenchView } from '../../store';
export interface IWorkbenchSingleViewProps {
    view: IWorkbenchView;
}
export declare function WorkbenchSingleView({ view }: IWorkbenchSingleViewProps): JSX.Element;
