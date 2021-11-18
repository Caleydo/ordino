import React from 'react';
import { IWorkbench } from '../store/ordinoSlice';
import { EWorkbenchType } from './Filmstrip';
interface IWorkbenchProps {
    workbench: IWorkbench;
    type?: EWorkbenchType;
    onScrollTo?: (ref: React.MutableRefObject<HTMLDivElement>) => void;
}
export declare function Workbench({ workbench, type, onScrollTo }: IWorkbenchProps): JSX.Element;
export {};
