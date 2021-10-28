import React from 'react';
import { IOrdinoViewPluginDesc } from '../store/ordinoSlice';
import { EWorkbenchType } from './Filmstrip';
export declare function Workbench(props: {
    view: IOrdinoViewPluginDesc;
    type: EWorkbenchType;
    style: React.CSSProperties;
}): JSX.Element;
