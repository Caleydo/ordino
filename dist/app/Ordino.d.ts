/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { ProvenanceGraph } from 'phovea_core';
import { CLUEGraphManager } from 'phovea_clue';
import { OrdinoApp } from '../internal/OrdinoApp';
import { ATDPApplication, ITDPOptions } from 'tdp_core';
export declare class Ordino extends ATDPApplication<OrdinoApp> {
    constructor(options?: Partial<ITDPOptions>);
    protected createApp(graph: ProvenanceGraph, manager: CLUEGraphManager, main: HTMLElement): Promise<any>;
    protected initSessionImpl(app: OrdinoApp): void;
}
