import { ProvenanceGraph } from 'phovea_core';
import { ReactNode } from 'react';
import { ISelection, ViewWrapper } from 'tdp_core';
interface IOrdinoViewWrapperProps {
    graph: ProvenanceGraph;
    wrapper: ViewWrapper;
    onSelectionChanged: (viewWrapper: ViewWrapper, oldSelection: ISelection, newSelection: ISelection, options?: any) => void;
    children?: ReactNode;
}
export declare function OrdinoViewWrapper({ graph, wrapper, children, onSelectionChanged }: IOrdinoViewWrapperProps): JSX.Element;
export {};
