import { EViewMode } from 'tdp_core';
interface ISelectionIndicatorProps {
    idType: string;
    selectionCount: number;
    viewMode: EViewMode;
}
export declare function SelectionCountIndicator({ selectionCount, viewMode, idType }: ISelectionIndicatorProps): JSX.Element;
export {};
