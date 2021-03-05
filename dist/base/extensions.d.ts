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
export declare const EXTENSION_POINT_START_MENU = "ordinoStartMenuSection";
export interface IStartMenuSectionDesc extends IPluginDesc {
    readonly name: string;
    readonly cssClass: string;
    load(): Promise<IStartMenuSectionPlugin>;
}
export interface IStartMenuSectionOptions {
    session?(viewId: string, options: {
        namedSet?: INamedSet;
        [key: string]: any;
    }, defaultSessionValues: any): void;
    graphManager: CLUEGraphManager;
}
interface IStartMenuSectionPlugin {
    desc: IStartMenuSectionDesc;
    factory(parent: HTMLElement, desc: IStartMenuSectionDesc, options: IStartMenuSectionOptions): IStartMenuSection;
}
export interface IStartMenuSection {
    readonly desc: IPluginDesc;
    push(namedSet: INamedSet): boolean;
    update?(): void;
}
export declare const EXTENSION_POINT_STARTMENU_DATASET = "ordinoStartMenuDataset";
export interface IStartMenuDatasetDesc extends IPluginDesc {
    readonly id: string;
    readonly name: string;
    readonly cssClass: string;
    readonly idType: string;
    readonly description: string;
    load(): Promise<IStartMenuDatasetPlugin>;
}
interface IStartMenuDatasetPlugin {
    desc: IStartMenuDatasetDesc;
    factory(parent: HTMLElement, desc: IStartMenuDatasetDesc, options: IStartMenuSectionOptions): IStartMenuDataset;
}
export interface IStartMenuDataset {
    push(namedSet: INamedSet): boolean;
    update(): void;
}
export {};
