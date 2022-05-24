import { MosaicBranch, MosaicPath } from 'react-mosaic-component';
import { IViewPluginDesc } from 'tdp_core';
import { IWorkbenchView } from '../../store';
export declare function WorkbenchEmptyView({ workbenchIndex, view, chooserOptions, mosaicDrag, path, removeCallback, }: {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
    mosaicDrag: boolean;
    path: MosaicBranch[];
    removeCallback: (path: MosaicPath) => void;
}): JSX.Element;
//# sourceMappingURL=WorkbenchEmptyView.d.ts.map