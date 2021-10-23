import { IViewPluginDesc } from 'tdp_core';
interface IDetailViewFilterProps {
    views: IViewPluginDesc[] | [];
    setFilteredViews: (views: IViewPluginDesc[]) => void;
}
export declare function DetailViewFilter(props: IDetailViewFilterProps): JSX.Element;
export {};
