import {ILocalDataProviderOptions, IDataProviderOptions, LocalDataProvider, ITaggleOptions, IGroupData, IGroupItem} from "lineupjs";
import {ISelection, IAdditionalColumnDesc, ISelectionAdapter, IDTypeLike, IDType, IRankingWrapper, IARankingViewOptions} from 'tdp_core';

export interface IRankingProps {
    data: any[];
    selection: ISelection;
    columnDesc: IAdditionalColumnDesc[];
    selectionAdapter?: ISelectionAdapter;
    options: Partial<IRankingOptions>;
    onUpdateEntryPoint?: (namedSet: unknown) => void;
    onItemSelectionChanged?: () => void;
    onItemSelect?: (current: ISelection, selection: ISelection, name: string) => void;
    onCustomizeRanking?: (rankingWrapper: IRankingWrapper) => void;
    onBuiltLineUp?: (provider: LocalDataProvider) => void;
}

export interface IRankingOptions extends IARankingViewOptions {
    // TODO:

}
