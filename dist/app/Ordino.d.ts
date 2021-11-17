/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { ProvenanceGraph } from 'tdp_core';
import { CLUEGraphManager } from 'tdp_core';
import { OrdinoApp } from '../internal/OrdinoApp';
import { ATDPApplication, ITDPOptions } from 'tdp_core';
export declare class Ordino extends ATDPApplication<OrdinoApp> {
    constructor(options?: Partial<ITDPOptions>);
    protected createApp(graph: ProvenanceGraph, manager: CLUEGraphManager, main: HTMLElement): Promise<OrdinoApp>;
    protected initSessionImpl(app: OrdinoApp): void;
}
