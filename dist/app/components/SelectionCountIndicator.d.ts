import { EViewMode } from 'tdp_core';
export interface ISelectionCountIndicatorProps {
    idType: string;
    selectionCount: number;
    viewMode: EViewMode;
}
export declare function SelectionCountIndicator({ selectionCount, viewMode, idType }: ISelectionCountIndicatorProps): JSX.Element;
