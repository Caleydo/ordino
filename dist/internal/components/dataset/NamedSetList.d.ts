import { INamedSet, IStoredNamedSet } from 'tdp_core';
import React from 'react';
interface INamedSetListProps {
    headerIcon: string;
    headerText: string;
    value: INamedSet[] | null;
    onOpen: (event: React.MouseEvent<HTMLElement>, namedSet: INamedSet) => void;
    status: 'idle' | 'pending' | 'success' | 'error';
    /**
     * Notify parent component to reload named sets on delete
     */
    onDeleteNamedSet?: (namedSet: IStoredNamedSet) => void;
    /**
     * Notify parent to reload named sets on edit
     */
    onEditNamedSet?: (namedSet: IStoredNamedSet) => void;
}
export declare function NamedSetList({ headerIcon, headerText, value: namedSets, status, onOpen, onEditNamedSet, onDeleteNamedSet }: INamedSetListProps): React.JSX.Element;
export {};
//# sourceMappingURL=NamedSetList.d.ts.map