import { INamedSet } from 'tdp_core';
interface INamedSetListProps {
    headerIcon: string;
    headerText: string;
    value: INamedSet[] | null;
    status: 'idle' | 'pending' | 'success' | 'error';
    error: Error | string | null;
    onclick?: () => null;
    readonly?: boolean;
}
export declare function NamedSetList({ headerIcon, headerText, value, status, error, readonly }: INamedSetListProps): JSX.Element;
export {};
