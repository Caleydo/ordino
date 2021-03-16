import { INamedSet } from 'tdp_core';
interface INamedSetListProps {
    headerIcon: string;
    headerText: string;
    namedSets: INamedSet[] | null;
    startViewId: string;
    status: 'idle' | 'pending' | 'success' | 'error';
    readonly?: boolean;
}
export declare function NamedSetList({ headerIcon, headerText, startViewId, namedSets, status, readonly }: INamedSetListProps): JSX.Element;
export {};
