import * as React from 'react';
import { CLUEGraphManager } from 'phovea_clue';
import { ProvenanceGraph } from 'phovea_core';
export declare const GraphContext: React.Context<{
    graph: ProvenanceGraph;
    manager: CLUEGraphManager;
}>;
export declare function StartMenuComponent({ headerMainMenu, manager, graph }: {
    headerMainMenu: HTMLElement;
    manager: CLUEGraphManager;
    graph: ProvenanceGraph;
}): JSX.Element;
