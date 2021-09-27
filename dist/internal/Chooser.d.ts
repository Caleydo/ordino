/// <reference types="react" />
import { IDType } from 'phovea_core';
import { ISelection, ViewWrapper } from 'tdp_core';
import { Range } from 'phovea_core';
interface IChooserProps {
    previousWrapper: ViewWrapper;
    selection: ISelection;
    onOpenView: (viewWrapper: ViewWrapper, viewId: string, idtype: IDType, selection: Range, options?: any) => void;
}
export declare const Chooser: ({ previousWrapper, selection, onOpenView }: IChooserProps) => JSX.Element;
export {};
