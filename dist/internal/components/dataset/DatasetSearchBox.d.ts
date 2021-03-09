import { IDataSourceConfig } from 'tdp_publicdb';
interface IDatasetSearchBoxProps {
    placeholder: string;
    viewId: string;
    datasource: IDataSourceConfig;
}
export declare function DatasetSearchBox({ placeholder, datasource, viewId }: IDatasetSearchBoxProps): JSX.Element;
export {};
