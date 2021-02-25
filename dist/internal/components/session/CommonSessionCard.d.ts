import { IProvenanceGraphDataDescription } from 'phovea_core';
import React from 'react';
import { DropdownItemProps } from 'react-bootstrap/esm/DropdownItem';
interface ICommonSessionCardProps {
    cardName: string;
    faIcon: string;
    cardInfo?: string;
    children?: (exportSession: SessionAction, cloneSession: SessionAction, saveSession?: SessionAction, deleteSession?: SessionAction) => React.ReactNode;
}
declare type SessionAction = (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription, callback?: (value: React.SetStateAction<IProvenanceGraphDataDescription[]>) => void) => boolean | Promise<boolean>;
export declare function CommonSessionCard({ cardName, faIcon, cardInfo, children }: ICommonSessionCardProps): JSX.Element;
export {};
