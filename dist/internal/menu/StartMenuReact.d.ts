import * as React from 'react';
import { CLUEGraphManager } from 'phovea_clue';
import { ProvenanceGraph } from 'phovea_core';
import { AppHeader } from 'phovea_ui';
export declare type StartMenuMode = 'start' | 'overlay';
export declare const GraphContext: React.Context<{
    graph: ProvenanceGraph;
    manager: CLUEGraphManager;
}>;
export declare function StartMenuComponent({ header, manager, graph, modePromise }: {
    header: AppHeader;
    manager: CLUEGraphManager;
    graph: ProvenanceGraph;
    modePromise: Promise<StartMenuMode>;
}): JSX.Element;
