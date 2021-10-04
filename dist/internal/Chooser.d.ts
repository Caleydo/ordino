/// <reference types="react" />
import { IDType } from 'phovea_core';
import { ViewWrapper } from 'tdp_core';
import { Range } from 'phovea_core';
interface IChooserProps {
    previousWrapper: ViewWrapper;
    onOpenView: (viewWrapper: ViewWrapper, viewId: string, idtype: IDType, selection: Range, options?: any) => void;
}
export declare const Chooser: ({ previousWrapper, onOpenView }: IChooserProps) => JSX.Element;
export {};
