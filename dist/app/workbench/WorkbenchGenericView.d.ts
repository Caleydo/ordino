import { IViewPluginDesc } from 'tdp_core';
import { MosaicBranch, MosaicPath } from 'react-mosaic-component';
import { IWorkbenchView } from '../../store';
export interface IWorkbenchGenericViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
    dragMode: boolean;
}
export declare function WorkbenchGenericView({ workbenchIndex, view, chooserOptions, dragMode, path, removeCallback, }: {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
    dragMode: boolean;
    path: MosaicBranch[];
    removeCallback: (path: MosaicPath) => void;
}): JSX.Element;
//# sourceMappingURL=WorkbenchGenericView.d.ts.map