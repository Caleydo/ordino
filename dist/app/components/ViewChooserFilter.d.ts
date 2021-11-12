import { IViewPluginDesc } from 'tdp_core';
export interface IViewChooserFilterProps {
    views: IViewPluginDesc[] | [];
    setFilteredViews: (views: IViewPluginDesc[]) => void;
}
export declare function ViewChooserFilter(props: IViewChooserFilterProps): JSX.Element;
