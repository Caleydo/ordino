import { IProvenanceGraphDataDescription } from 'phovea_core';
import React from 'react';
import { DropdownItemProps } from 'react-bootstrap/esm/DropdownItem';
interface ISavedSessionListItemProps {
    value: IProvenanceGraphDataDescription | null;
    status: 'idle' | 'pending' | 'success' | 'error';
    error: string | null;
    deleteSession?: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
    editSession?: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
    cloneSession?: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
    exportSession?: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
    children?: React.ReactNode;
}
export declare function SavedSessionListItem({ status, value, error, editSession, cloneSession, exportSession, deleteSession, children }: ISavedSessionListItemProps): JSX.Element;
export {};
