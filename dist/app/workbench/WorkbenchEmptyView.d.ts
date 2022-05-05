import { MosaicBranch } from 'react-mosaic-component';
import { IViewPluginDesc } from 'tdp_core';
import { IWorkbenchView } from '../../store';
export declare function WorkbenchEmptyView({ workbenchIndex, view, chooserOptions, dragMode, path, setMosaicDrag, }: {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
    dragMode: boolean;
    path: MosaicBranch[];
    setMosaicDrag: (b: boolean) => void;
}): JSX.Element;
//# sourceMappingURL=WorkbenchEmptyView.d.ts.map