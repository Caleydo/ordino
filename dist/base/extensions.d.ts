/** ******************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ******************************************************************* */
/// <reference types="react" />
import { IPluginDesc, INamedSet, CLUEGraphManager } from 'tdp_core';
import { EStartMenuSection } from '../internal/constants';
import type { IStartMenuTabProps } from '../internal/interfaces';
export declare const EP_ORDINO_START_MENU_TAB = "epOrdinoStartMenuTab";
/**
 * Register a new tab in the ordino start menu
 */
export interface IStartMenuTabDesc extends IPluginDesc {
    /**
     * Name of the plugin, should be unique within a type
     */
    id: string;
    /**
     * Used as text for the NavTab button
     */
    text?: string;
    /**
     * Font Awesome icon
     * Will be used a as button icon
     * @see https://fontawesome.com/
     * @example `fas fa-database`
     */
    icon?: string;
    /**
     * Whether to render the tab on the `mainMenu` or the `rightMenu` section in the header
     */
    readonly menu: EStartMenuSection;
    /**
     * Function for loading this plugin
     * @returns a promise for the loaded plugin
     */
    load(): Promise<IStartMenuTabPlugin>;
}
export interface IStartMenuTabPlugin {
    desc: IStartMenuTabDesc;
    factory(props: IStartMenuTabProps): JSX.Element;
}
export interface IStartMenuTab {
    readonly desc: IStartMenuTabDesc;
    update?(): void;
}
export declare const EP_ORDINO_START_MENU_TAB_SHORTCUT = "epOrdinoStartMenuTabShortcut";
/**
 * Add a shortcut for a start menu tab
 */
export interface IStartMenuTabShortcutDesc extends Omit<IStartMenuTabDesc, 'menu'> {
    /**
     * Open the selected tab on click
     */
    tabId: string;
    /**
     * Highlight a card after opening the tab
     * Currently, only used to highlight the `CurrentSessionCard`
     */
    setHighlight?: boolean;
}
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
export declare const EP_ORDINO_HEADER_MENU = "epOrdinoHeaderMenu";
/**
 * Register links to the header menu
 * Only a single header menu is considered
 */
export interface IOrdinoHeaderMenuDesc extends IPluginDesc {
    /**
     * List of links
     */
    readonly links: IOrdinoHeaderMenuLink[];
}
export interface IOrdinoHeaderMenuLink {
    /**
     * URL to the page
     */
    page: string;
    /**
     * Link text
     */
    text: string;
    /**
     * FontAwesome icon
     * @example `fas fa-question`
     */
    faIcon?: string;
}
export declare const EP_ORDINO_FOOTER_MENU = "epOrdinoFooterMenu";
/**
 * Register links to the footer menu
 * Only a single footer menu is considered
 */
export interface IOrdinoFooterMenuDesc extends IPluginDesc {
    /**
     * Nested list of links for the menu
     * - First level = list group
     * - Second level = list items (= links)
     */
    readonly lists: IOrdinoFooterMenuLink[][];
}
export interface IOrdinoFooterMenuLink {
    /**
     * URL to the page
     */
    page: string;
    /**
     * Link text
     */
    text: string;
    /**
     * FontAwesome icon
     * @example `fas fa-question`
     */
    faIcon?: string;
}
export declare const EP_ORDINO_LOGO = "epOrdinoLogo";
/**
 * Overwrite the default app icon and name
 * Only the last registration is considered
 */
export interface IOrdinoLogoDesc extends IPluginDesc {
    /**
     * Name of the app
     */
    readonly text: string;
    /**
     * Height of the logo in pixel
     * @default 30
     */
    readonly width?: number;
    /**
     * Width of the logo in pixel
     * @default 30
     */
    readonly height?: number;
}
export {};
//# sourceMappingURL=extensions.d.ts.map