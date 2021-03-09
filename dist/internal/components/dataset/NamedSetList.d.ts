import { INamedSet } from 'tdp_core';
interface INamedSetListProps {
    headerIcon: string;
    headerText: string;
    value: INamedSet[] | null;
    viewId: string;
    status: 'idle' | 'pending' | 'success' | 'error';
    readonly?: boolean;
}
export declare function NamedSetList({ headerIcon, headerText, viewId, value, status, readonly }: INamedSetListProps): JSX.Element;
export {};
