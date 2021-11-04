import { IProvenanceGraphDataDescription } from 'tdp_core';
import React from 'react';
import { SessionAction } from './CommonSessionCard';
interface ISessionListItemProps {
    desc: IProvenanceGraphDataDescription | null;
    /**
     * Opens the session. If not provided then the session can only be cloned to a temporary session.
     */
    selectSession?: SessionAction;
    children?: React.ReactNode;
}
export declare function SessionListItem({ desc, selectSession, children }: ISessionListItemProps): JSX.Element;
export {};
