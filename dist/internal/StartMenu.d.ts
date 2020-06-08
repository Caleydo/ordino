/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { OrdinoApp } from './OrdinoApp';
import { INamedSet } from 'tdp_core';
export declare class StartMenu {
    private readonly app;
    private readonly $node;
    private sections;
    private $sections;
    /**
     * Save an old key down listener to restore it later
     */
    private restoreKeyDownListener;
    constructor(parent: Element, app: OrdinoApp);
    /**
     * Opens the start menu and attaches an key down listener, to close the menu again pressing the ESC key
     */
    open(): void;
    /**
     * Close the start menu and restore an old key down listener
     */
    close(): void;
    /**
     * Update entry point list for a given idType and an additional namedSet that should be appended
     * @param namedSet
     */
    pushNamedSet(namedSet: INamedSet): void;
    /**
     * Build multiple sections with entries grouped by database
     */
    private build;
    private hasSection;
    /**
     * Loops through all sections and updates them (or the entry points) if necessary
     */
    private updateSections;
}
