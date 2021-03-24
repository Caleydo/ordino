import React from 'react';
import { INamedSet } from 'tdp_core';
interface INamedSetListProps {
    headerIcon: string;
    headerText: string;
    value: INamedSet[] | null;
    onOpen: (event: React.MouseEvent<HTMLElement>, namedSet: INamedSet) => void;
    status: 'idle' | 'pending' | 'success' | 'error';
}
export declare function NamedSetList({ headerIcon, headerText, value, status, onOpen }: INamedSetListProps): JSX.Element;
export {};
