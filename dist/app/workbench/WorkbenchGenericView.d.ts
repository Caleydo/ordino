import { IWorkbenchView } from '../../store';
import { IViewPluginDesc } from 'tdp_core';
export interface IWorkbenchGenericViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
    showChooser?: boolean;
}
export declare function WorkbenchGenericView({ workbenchIndex, view, chooserOptions, showChooser }: IWorkbenchGenericViewProps): JSX.Element;
//# sourceMappingURL=WorkbenchGenericView.d.ts.map