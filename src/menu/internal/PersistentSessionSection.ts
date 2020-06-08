/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/

import {IStartMenuSection, IStartMenuSectionDesc, IStartMenuSectionOptions} from '../../base/extensions';
import {INamedSet} from 'tdp_core';
import {PersistentSessionList} from 'tdp_core';

export class TemporarySessionSection implements IStartMenuSection {
  constructor(parent: HTMLElement, public readonly desc: IStartMenuSectionDesc, options: IStartMenuSectionOptions) {
    const _ = new PersistentSessionList(parent, options.graphManager);
  }

  push(namedSet: INamedSet) {
    return false;
  }
}
