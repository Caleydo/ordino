import { IDataSourceConfig } from '../../../../../tdp_publicdb/dist/common/config';
export interface IStartMenuCard {
    id: string;
    name: string;
    headerIcon: string;
    viewId: string;
    datasource: IDataSourceConfig;
    tabs: IStartMenuSectionTab[];
}
export interface IStartMenuSectionTab {
    id: string;
    tabText: string;
    tabIcon: string;
}
export declare function DatasetsTab(): JSX.Element;
