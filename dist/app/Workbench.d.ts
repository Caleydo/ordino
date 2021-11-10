import React from 'react';
import { IOrdinoViewPluginDesc } from '../store/ordinoSlice';
import { EWorkbenchType } from './Filmstrip';
interface IWorkbenchProps {
    view: IOrdinoViewPluginDesc;
    type?: EWorkbenchType;
    onScrollTo?: (ref: React.MutableRefObject<HTMLDivElement>) => void;
}
export declare function Workbench({ view, type, onScrollTo }: IWorkbenchProps): JSX.Element;
export {};
