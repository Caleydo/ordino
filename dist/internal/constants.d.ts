/** ******************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ******************************************************************* */
import React from 'react';
import { CLUEGraphManager, ProvenanceGraph } from 'tdp_core';
import type { IOrdinoApp } from './IOrdinoApp';
export declare const MODE_ANIMATION_TIME: number;
export declare enum EStartMenuSection {
    /**
     * Main menu section in the header
     */
    MAIN = "main",
    /**
     * Right menu section in the header
     */
    RIGHT = "right"
}
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
export declare enum EStartMenuOpen {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    OPEN = "open",
    /**
     * an analysis in the background, the start menu can be closed
     */
    CLOSED = "closed"
}
export declare const OrdinoContext: React.Context<{
    app: IOrdinoApp;
}>;
export declare const GraphContext: React.Context<{
    graph: ProvenanceGraph;
    manager: CLUEGraphManager;
}>;
export declare const HighlightSessionCardContext: React.Context<{
    highlight: boolean;
    setHighlight: React.Dispatch<React.SetStateAction<boolean>>;
}>;
//# sourceMappingURL=constants.d.ts.map