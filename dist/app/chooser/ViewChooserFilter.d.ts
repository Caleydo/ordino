import { IViewPluginDesc } from 'tdp_core';
interface IViewChooserFilterProps {
    views: IViewPluginDesc[] | [];
    setFilteredViews: (views: IViewPluginDesc[]) => void;
}
export declare function ViewChooserFilter(props: IViewChooserFilterProps): JSX.Element;
export {};
