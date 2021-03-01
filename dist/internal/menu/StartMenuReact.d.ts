import * as React from 'react';
import { CLUEGraphManager } from 'phovea_clue';
import { ProvenanceGraph } from 'phovea_core';
import { OrdinoApp } from '../..';
export declare const GraphContext: React.Context<{
    graph: ProvenanceGraph;
    manager: CLUEGraphManager;
    app: OrdinoApp;
}>;
export declare function StartMenuComponent({ headerMainMenu, manager, graph, app }: {
    headerMainMenu: HTMLElement;
    manager: CLUEGraphManager;
    graph: ProvenanceGraph;
    app: OrdinoApp;
}): JSX.Element;
