/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { IObjectRef, ProvenanceGraph } from 'phovea_core';
import { IDType } from 'phovea_core';
import { EventHandler } from 'phovea_core';
import { ViewWrapper } from './ViewWrapper';
import { CLUEGraphManager } from 'phovea_clue';
import { Range } from 'phovea_core';
import { IOrdinoApp } from './IOrdinoApp';
export declare const EXTENSION_POINT_WELCOME_PAGE = "ordinoWelcomeView";
/**
 * The main class for the Ordino app
 * This class ...
 * - handles the creation, removal, and focus of views
 * - provides a reference to open views
 * - provides a reference to the provenance graph
 */
export declare class OrdinoApp extends EventHandler implements IOrdinoApp {
    readonly graph: ProvenanceGraph;
    readonly graphManager: CLUEGraphManager;
    static readonly EVENT_OPEN_START_MENU = "openStartMenu";
    /**
     * List of open views (e.g., to show in the history)
     * @type {ViewWrapper[]}
     */
    readonly views: ViewWrapper[];
    /**
     * IObjectRef to this OrdinoApp instance
     * @type {IObjectRef<OrdinoApp>}
     */
    readonly ref: IObjectRef<OrdinoApp>;
    private readonly $history;
    private readonly $node;
    private readonly removeWrapper;
    private readonly chooseNextView;
    private readonly updateSelection;
    constructor(graph: ProvenanceGraph, graphManager: CLUEGraphManager, parent: HTMLElement);
    /**
     * Loads registered welcome pages from the extension points.
     * The welcome page with the highest priority is loaded and shown.
     *
     * @param {HTMLElement} parent
     */
    private buildWelcomeView;
    private buildHistory;
    get node(): Element;
    /**
     * Decide if a new view should be opened or an existing (right) detail view should be closed.
     * Closed: When the view to the right is equal to the new one
     * Open or replace: When the new view is different from the next view
     * @param viewWrapper
     * @param viewId
     * @param idtype
     * @param selection
     * @param options
     */
    private handleNextView;
    /**
     * Opens a new view using the viewId, idtype, selection and options.
     *
     * @param viewWrapper The view that triggered the opener event.
     * @param viewId The new view that should be opened to the right.
     * @param idtype
     * @param selection
     * @param options
     */
    private openOrReplaceNextView;
    /**
     * Sets the new given item selection to the last open view and stores an action in the provenance graph.
     * @param viewWrapper
     * @param oldSelection
     * @param newSelection
     * @param options
     */
    private updateItemSelection;
    /**
     * The last view of the list of open views
     */
    get lastView(): ViewWrapper;
    push(viewId: string, idtype: IDType, selection: Range, options?: any): Promise<import("phovea_core").ICmdResult> | PromiseLike<Promise<import("phovea_core").ICmdResult>>;
    initNewSession(view: string, options: any, defaultSessionValues?: any): void;
    private pushView;
    /**
     * Removes a view, and if there are multiple open (following) views, close them in reverse order.
     * @param viewWrapper
     */
    remove(indexOrView: number | ViewWrapper): void;
    pushImpl(view: ViewWrapper): Promise<number>;
    removeImpl(view: ViewWrapper, focus?: number): Promise<number>;
    private replaceView;
    /**
     * Jumps to a given viewWrapper in the provenance graph
     * @param view
     * @returns {any} Promise
     */
    focus(view: ViewWrapper): PromiseLike<any>;
    /**
     * Jumps back to the root of the provenance graph and consequentially removes all open views (undo)
     */
    removeLastImpl(): Promise<number>;
    showInFocus(d: ViewWrapper): void;
    focusImpl(index: number): Promise<number>;
    /**
     * updates the views information, e.g. history
     */
    update(): void;
}
