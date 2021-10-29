import { IViewPluginDesc } from 'tdp_core';
export interface IViewGroupDesc {
    name: string;
    items: IViewPluginDesc[];
}
interface IViewChooserProps {
    index: number;
    views: IViewPluginDesc[];
    selectedView?: IViewPluginDesc;
    onSelectedView: (view: IViewPluginDesc, viewIndex: number) => void;
}
export declare function ViewChooser(props: IViewChooserProps): JSX.Element;
export {};
