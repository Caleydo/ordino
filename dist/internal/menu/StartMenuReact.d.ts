import * as React from 'react';
import { CLUEGraphManager } from 'phovea_clue';
import { ProvenanceGraph } from 'phovea_core';
import { IOrdinoOptions } from '../..';
export declare const GraphContext: React.Context<{
    graph: ProvenanceGraph;
    manager: CLUEGraphManager;
    options: IOrdinoOptions;
}>;
export declare function StartMenuComponent({ headerMainMenu, manager, graph, options }: {
    headerMainMenu: HTMLElement;
    manager: CLUEGraphManager;
    graph: ProvenanceGraph;
    options: IOrdinoOptions;
}): JSX.Element;
