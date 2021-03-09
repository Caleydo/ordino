interface IHeaderOptions {
    color: 'black' | 'white';
    size: 'sm' | 'md' | 'lg';
}
export interface IAppOptions {
    enableDatasetsTab?: boolean;
    enableToursTab?: boolean;
    enableSessionsTab?: boolean;
    enableMoreTab?: boolean;
    header: IHeaderOptions;
}
export {};
