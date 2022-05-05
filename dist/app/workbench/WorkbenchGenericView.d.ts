import { IViewPluginDesc } from 'tdp_core';
import { MosaicBranch } from 'react-mosaic-component';
import { IWorkbenchView } from '../../store';
export interface IWorkbenchGenericViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
    dragMode: boolean;
}
export declare function WorkbenchGenericView({ workbenchIndex, view, chooserOptions, dragMode, path, setMosaicDrag, }: {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
    dragMode: boolean;
    path: MosaicBranch[];
    setMosaicDrag: (b: boolean) => void;
}): JSX.Element;
//# sourceMappingURL=WorkbenchGenericView.d.ts.map