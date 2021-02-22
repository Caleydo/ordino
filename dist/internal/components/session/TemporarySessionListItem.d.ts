import { IProvenanceGraphDataDescription } from 'phovea_core';
import React from 'react';
import { DropdownItemProps } from 'react-bootstrap/esm/DropdownItem';
interface ITemporarySessionListItemProps {
    value: IProvenanceGraphDataDescription | null;
    status: 'idle' | 'pending' | 'success' | 'error';
    error: string | null;
    deleteSession: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
    saveSession: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
    cloneSession: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
}
export declare function TemporarySessionListItem({ status, value, error, saveSession, cloneSession, deleteSession }: ITemporarySessionListItemProps): JSX.Element;
export {};
