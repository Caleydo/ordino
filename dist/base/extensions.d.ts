/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { IPluginDesc } from 'phovea_core';
import { INamedSet } from 'tdp_core';
import { CLUEGraphManager } from 'phovea_clue';
import { IStartMenuDatasetSectionTab } from '../internal/menu/tabs/DatasetsTab';
export declare const EP_ORDINO_STARTMENU_SESSION_SECTION = "epOrdinoStartMenuSessionSection";
/**
 * Register a new section in the start menu sessions tab
 */
export interface IStartMenuSessionSectionDesc extends IPluginDesc {
    readonly name: string;
    readonly faIcon: string;
    load(): Promise<IStartMenuSessionSectionPlugin>;
}
export interface IStartMenuSessionSectionOptions {
    session?(viewId: string, options: {
        namedSet?: INamedSet;
        [key: string]: any;
    }, defaultSessionValues: any): void;
    graphManager: CLUEGraphManager;
}
interface IStartMenuSessionSectionPlugin {
    desc: IStartMenuSessionSectionDesc;
    factory(props: IStartMenuSessionSectionDesc): JSX.Element;
}
export interface IStartMenuSessionSection {
    readonly desc: IPluginDesc;
    push(namedSet: INamedSet): boolean;
    update?(): void;
}
/**
 * Register a new section in the start menu datasets tab
 */
export declare const EP_ORDINO_STARTMENU_DATASET_SECTION = "epOrdinoStartMenuDatasetSection";
export interface IStartMenuDatasetSectionDesc extends IPluginDesc {
    id: string;
    name: string;
    headerIcon: string;
    viewId: string;
    tabs: IStartMenuDatasetSectionTab[];
    load(): Promise<IStartMenuDatasetSectionPlugin>;
}
interface IStartMenuDatasetSectionPlugin {
    desc: IStartMenuDatasetSectionDesc;
    factory(props: IStartMenuDatasetSectionDesc): JSX.Element;
}
export interface IStartMenuDatasetSection {
    push(namedSet: INamedSet): boolean;
    update(): void;
}
export {};
