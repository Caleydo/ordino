import { IColumnDesc } from 'lineupjs';
import { IViewPluginDesc } from 'tdp_core';
export interface IVisynViewPluginDesc extends Pick<IViewPluginDesc, 'selection'> {
    rankingOptions?: {
        columns: IColumnDesc[];
    };
}
export interface IRankingVisynViewPluginDesc extends IVisynViewPluginDesc {
    rankingOptions?: {
        columns: IColumnDesc[];
    };
}
export interface IVisynViewProps<C extends IVisynViewPluginDesc, P> {
    desc: C;
    data: {
        [key: string]: any;
    };
    dataDesc: any[];
    selection: string[];
    filters: string[];
    parameters: P;
    onSelectionChanged: (selection: string[]) => void;
    onFiltersChanged: any;
    onParametersChanged: (parameters: P) => void;
}
