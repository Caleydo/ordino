/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { PersistentSessionList } from 'tdp_core';
export class PersistentSessionSection {
    constructor(parent, desc, options) {
        this.desc = desc;
        const _ = new PersistentSessionList(parent, options.graphManager);
    }
    push(namedSet) {
        return false;
    }
}
//# sourceMappingURL=PersistentSessionSection.js.map