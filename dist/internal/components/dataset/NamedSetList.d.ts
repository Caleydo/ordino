import React from 'react';
import { DropdownItemProps } from 'react-bootstrap/esm/DropdownItem';
import { INamedSet } from 'tdp_core';
interface INamedSetListProps {
    headerIcon: string;
    headerText: string;
    value: INamedSet[] | null;
    onOpen: (event: React.MouseEvent<DropdownItemProps>, namedSet: INamedSet) => void;
    status: 'idle' | 'pending' | 'success' | 'error';
}
export declare function NamedSetList({ headerIcon, headerText, value, status, onOpen }: INamedSetListProps): JSX.Element;
export {};
