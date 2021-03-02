import * as React from 'react';
import { CLUEGraphManager } from 'phovea_clue';
import { ProvenanceGraph } from 'phovea_core';
import { AppHeader } from 'phovea_ui';
export declare enum EStartMenuMode {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    START = "start",
    /**
     * an analysis in the background, the start menu can be closed
     */
    OVERLAY = "overlay"
}
export declare const GraphContext: React.Context<{
    graph: ProvenanceGraph;
    manager: CLUEGraphManager;
}>;
export declare function StartMenuComponent({ header, manager, graph, mode }: {
    header: AppHeader;
    manager: CLUEGraphManager;
    graph: ProvenanceGraph;
    mode: EStartMenuMode;
}): JSX.Element;
