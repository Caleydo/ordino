import { INamedSet } from 'tdp_core';
interface INamedSetListProps {
    headerIcon: string;
    headerText: string;
    value: INamedSet[] | null;
    startViewId: string;
    status: 'idle' | 'pending' | 'success' | 'error';
}
export declare function NamedSetList({ headerIcon, headerText, value, startViewId, status }: INamedSetListProps): JSX.Element;
export {};
