import { IViewPluginDesc } from 'tdp_core';
import { IWorkbenchView } from '../../store';
export interface IWorkbenchGenericViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
}
export declare function WorkbenchEmptyView({ workbenchIndex, view, chooserOptions }: IWorkbenchGenericViewProps): JSX.Element;
//# sourceMappingURL=WorkbenchEmptyView.d.ts.map