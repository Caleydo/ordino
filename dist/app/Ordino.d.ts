/** ******************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ******************************************************************* */
import { ProvenanceGraph, CLUEGraphManager, ATDPApplication, ITDPOptions } from 'tdp_core';
import { OrdinoApp } from '../internal/OrdinoApp';
export declare class Ordino extends ATDPApplication<OrdinoApp> {
    constructor(options?: Partial<ITDPOptions>);
    protected createApp(graph: ProvenanceGraph, manager: CLUEGraphManager, main: HTMLElement): Promise<OrdinoApp>;
    protected initSessionImpl(app: OrdinoApp): Promise<void>;
}
//# sourceMappingURL=Ordino.d.ts.map