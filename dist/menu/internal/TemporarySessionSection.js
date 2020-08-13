/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { TemporarySessionList } from 'tdp_core';
export class TemporarySessionSection {
    constructor(parent, desc, options) {
        this.desc = desc;
        const _ = new TemporarySessionList(parent, options.graphManager);
    }
    push(namedSet) {
        return false;
    }
}
//# sourceMappingURL=TemporarySessionSection.js.map