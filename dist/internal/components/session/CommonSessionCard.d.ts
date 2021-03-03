import { IProvenanceGraphDataDescription } from 'phovea_core';
import React from 'react';
import { DropdownItemProps } from 'react-bootstrap/esm/DropdownItem';
interface ICommonSessionCardProps {
    cardName: string;
    faIcon: string;
    cardInfo?: string;
    children?: (sessionAction: SessionActionChooser) => React.ReactNode;
}
export declare const enum Action {
    SELECT = "select",
    SAVE = "save",
    EDIT = "edit",
    CLONE = "clone",
    EXPORT = "epxport",
    DELETE = "delete"
}
export declare type SessionActionChooser = (type: Action, event: React.MouseEvent<DropdownItemProps | HTMLElement>, desc: IProvenanceGraphDataDescription, updateSessions?: any) => boolean | Promise<boolean>;
export declare type SessionAction = (event: React.MouseEvent<DropdownItemProps | HTMLElement>, desc: IProvenanceGraphDataDescription, updateSessions?: any) => boolean | Promise<boolean>;
export declare function CommonSessionCard({ cardName, faIcon, cardInfo, children }: ICommonSessionCardProps): JSX.Element;
export {};
