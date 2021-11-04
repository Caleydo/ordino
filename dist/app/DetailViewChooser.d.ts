import { IViewPluginDesc } from 'tdp_core';
export interface IViewGroupDesc {
    name: string;
    items: IViewPluginDesc[];
}
interface IDetailViewChooserProps {
    index: number;
    views: IViewPluginDesc[];
    selectedView?: IViewPluginDesc;
    onSelectedView: (view: IViewPluginDesc, viewIndex: number) => void;
}
export declare function DetailViewChooser(props: IDetailViewChooserProps): JSX.Element;
export {};
