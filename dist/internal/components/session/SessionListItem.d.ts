import { IProvenanceGraphDataDescription } from 'phovea_core';
import React from 'react';
interface ISessionListItemProps {
    desc: IProvenanceGraphDataDescription | null;
    status: 'idle' | 'pending' | 'success' | 'error';
    error: string | null;
    children?: React.ReactNode;
}
export declare function SessionListItem({ status, desc, error, children }: ISessionListItemProps): JSX.Element;
export {};
