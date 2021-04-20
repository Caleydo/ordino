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
/**
 * Interface describing a section for the datasets tab of the start menu
 */
export interface IStartMenuDatasetSectionDesc extends IPluginDesc {
    /**
     * Name of the plugin, should be unique within a type
     */
    id: string;
    /**
     * Human readable name of this plugin
     */
    name: string;
    /**
     * Font Awesome icon
     * Could be used in the section header
     * @see https://fontawesome.com/
     * @example `fas fa-database`
     */
    icon: string;
    /**
     * IDType of the section
     * Can be used to fetch matching data from the backend
     */
    idType: string;
    /**
     * View ID used as first view when selecting a dataset
     */
    startViewId: string;
    /**
     * Function for loading this plugin
     * @returns a promise for the loaded plugin
     */
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
