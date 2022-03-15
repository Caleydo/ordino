import { INamedSet } from 'tdp_core';
import React from 'react';
interface INamedSetListProps {
    headerIcon: string;
    headerText: string;
    value: INamedSet[] | null;
    onOpen: (event: React.MouseEvent<HTMLElement>, namedSet: INamedSet) => void;
    status: 'idle' | 'pending' | 'success' | 'error';
}
export declare function NamedSetList({ headerIcon, headerText, value, status, onOpen }: INamedSetListProps): JSX.Element;
export {};
//# sourceMappingURL=NamedSetList.d.ts.map