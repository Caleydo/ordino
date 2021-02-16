import { INamedSet } from 'tdp_core';
interface INamedSetListProps {
    headerIcon: string;
    headerText: string;
    loadEntries: () => Promise<INamedSet[]>;
    onclick?: () => null;
    readonly?: boolean;
}
export declare function NamedSetList({ headerIcon, headerText, loadEntries, readonly }: INamedSetListProps): JSX.Element;
export {};
