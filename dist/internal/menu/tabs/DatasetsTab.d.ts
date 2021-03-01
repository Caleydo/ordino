import { IDataSourceConfig } from '../../../../../tdp_publicdb/dist/common/config';
export interface IStartMenuCard {
    id: string;
    headerText: string;
    headerIcon: string;
    datasource: IDataSourceConfig;
    dbViewSuffix: string;
    tabs: IStartMenuSectionTab[];
}
export interface IStartMenuSectionTab {
    id: string;
    tabText: string;
    tabIcon: string;
}
export declare function DatasetsTab(): JSX.Element;
