/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { IStartMenuSessionSection, IStartMenuSessionSectionDesc, IStartMenuSessionSectionOptions } from '../../base/extensions';
import { INamedSet } from 'tdp_core';
export declare class PersistentSessionSection implements IStartMenuSessionSection {
    readonly desc: IStartMenuSessionSectionDesc;
    constructor(parent: HTMLElement, desc: IStartMenuSessionSectionDesc, options: IStartMenuSessionSectionOptions);
    push(namedSet: INamedSet): boolean;
}
