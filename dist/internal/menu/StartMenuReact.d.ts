import * as React from 'react';
import { CLUEGraphManager } from 'phovea_clue';
import { ProvenanceGraph } from 'phovea_core';
export declare type StartMenuMode = 'start' | 'overlay';
export declare const GraphContext: React.Context<{
    graph: ProvenanceGraph;
    manager: CLUEGraphManager;
}>;
export declare function StartMenuComponent({ headerMainMenu, manager, graph, modePromise }: {
    headerMainMenu: HTMLElement;
    manager: CLUEGraphManager;
    graph: ProvenanceGraph;
    modePromise: Promise<StartMenuMode>;
}): JSX.Element;
