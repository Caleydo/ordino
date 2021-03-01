import { IDataSourceConfig } from '../../../../../tdp_publicdb/dist/common/config';
interface IDatasetSearchBoxProps extends IDataSourceConfig {
    placeholder: string;
    dbViewSuffix: string;
}
export declare function DatasetSearchBox({ placeholder, dbViewSuffix, idType: idtype, db, base, entityName }: IDatasetSearchBoxProps): JSX.Element;
export {};
