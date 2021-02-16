interface IDatasetTab {
    id: string;
    tabText: string;
    tabIcon: string;
}
interface IDatasetCardProps {
    id: string;
    headerText: string;
    headerIcon: string;
    database: string;
    dbViewBase: string;
    idType: string;
    tabs: IDatasetTab[];
}
export declare function DatasetCard({ headerText, headerIcon, database, dbViewBase, idType, tabs }: IDatasetCardProps): JSX.Element;
export {};
