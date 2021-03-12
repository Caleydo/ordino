import { INamedSet } from 'tdp_core';
interface INamedSetListProps {
    headerIcon: string;
    headerText: string;
    value: INamedSet[] | null;
    onOpen: (event: any, namedSet: INamedSet) => void;
    status: 'idle' | 'pending' | 'success' | 'error';
    readonly?: boolean;
}
export declare function NamedSetList({ headerIcon, headerText, onOpen, value, status, readonly }: INamedSetListProps): JSX.Element;
export {};
