import { IViewPluginDesc } from 'tdp_core';
import { MosaicBranch } from 'react-mosaic-component';
import { IWorkbenchView } from '../../store';
export interface IWorkbenchGenericViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
    dragMode: boolean;
}
export declare function WorkbenchGenericView({ workbenchIndex, view, chooserOptions, mosaicDrag, path, }: {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
    mosaicDrag: boolean;
    path: MosaicBranch[];
}): JSX.Element;
//# sourceMappingURL=WorkbenchGenericView.d.ts.map