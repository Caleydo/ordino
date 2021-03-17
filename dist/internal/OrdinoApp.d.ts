/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import * as React from 'react';
import { ICmdResult } from 'phovea_core';
import { IObjectRef, ProvenanceGraph, IDType } from 'phovea_core';
import { ViewWrapper } from './ViewWrapper';
import { CLUEGraphManager } from 'phovea_clue';
import { Range } from 'phovea_core';
import { IOrdinoApp } from './IOrdinoApp';
import { EStartMenuMode, EStartMenuOpen } from './menu/StartMenuReact';
import { AppHeader } from 'phovea_ui';
export declare const OrdinoContext: React.Context<{
    app: IOrdinoApp;
}>;
export declare const GraphContext: React.Context<{
    graph: ProvenanceGraph;
    manager: CLUEGraphManager;
}>;
interface IOrdinoAppProps {
    graph: ProvenanceGraph;
    graphManager: CLUEGraphManager;
    header: AppHeader;
}
interface IOrdinoAppState {
    mode: EStartMenuMode;
    open: EStartMenuOpen;
    views: ViewWrapper[];
}
/**
 * The main class for the Ordino app
 * This class ...
 * - handles the creation, removal, and focus of views
 * - provides a reference to open views
 * - provides a reference to the provenance graph
 */
export declare class OrdinoApp extends React.Component<IOrdinoAppProps, IOrdinoAppState> implements IOrdinoApp {
    /**
     * Key for the session storage that is temporarily used when starting a new analysis session
     */
    private static SESSION_KEY_START_NEW_SESSION;
    /**
     * IObjectRef to this OrdinoApp instance
     * @type {IObjectRef<OrdinoApp>}
     */
    readonly ref: IObjectRef<OrdinoApp>;
    /**
     * React DOM node reference
     */
    private readonly nodeRef;
    private readonly removeWrapper;
    private readonly chooseNextView;
    private readonly updateSelection;
    constructor(props: any);
    /**
     * This function can be used to load some initial content async
     */
    initApp(): Promise<any>;
    /**
     * Set the mode and open/close state of the start menu.
     * Set both options at once to avoid multiple rerender.
     * @param open Open/close state
     * @param mode Overlay/start mode
     */
    setStartMenuState(open: EStartMenuOpen, mode: EStartMenuMode): void;
    /**
     * List of open views (e.g., to show in the history)
     */
    get views(): ViewWrapper[];
    get node(): HTMLDivElement;
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
    push(viewId: string, idtype: IDType, selection: Range, options?: any): Promise<ICmdResult> | PromiseLike<Promise<ICmdResult>>;
    /**
     * Starts a new analysis session with a given view and additional options.
     * The default session values are permanently stored in the provenance graph and the session storage.
     *
     * All provided parameters are persisted to the session storage.
     * Then a new analysis session (provenance graph) is created by reloading the page.
     * After the page load a new session is available and new actions for the initial view
     * are pushed to the provenance graph (see `initNewSession()`).
     *
     * @param startViewId First view of the analysis session
     * @param startViewOptions Options that are passed to the initial view (e.g. a NamedSet)
     * @param defaultSessionValues Values that are stored in the in the provenance graph and the session storage
     */
    startNewSession(startViewId: string, startViewOptions: any, defaultSessionValues?: any): void;
    /**
     * This function is the counter part to `startNewSession()`.
     * It initializes the new session with the empty provenance graph which is created with the page reload.
     * If initial data is available in the session storage (stored before page reload),
     * it is used to store the default session values into the session storage
     * and push the first view.
     * If no initial data is avaialble the start menu will be opened.
     */
    initNewSessionAfterPageReload(): void;
    /**
     * Push availabe default session values to provenance graph first.
     * Then push the first view and close the start menu.
     *
     * @param startViewId First view of the analysis session
     * @param startViewOptions Options that are passed to the initial view (e.g. a NamedSet)
     * @param defaultSessionValues Values that are stored in the provenance graph and the session storage
     */
    private pushStartViewToSession;
    private pushView;
    /**
     * Removes a view, and if there are multiple open (following) views, close them in reverse order.
     * @param viewWrapper
     */
    private remove;
    /**
     * Add a new view wrapper to the list of open views.
     * The return value is index in the list of views.
     * @param view ViewWrapper
     */
    pushImpl(view: ViewWrapper): Promise<number>;
    /**
     * Remove the given and focus on the view with the given index.
     * If the focus index is -1 the previous view of the given view will be focused.
     *
     * @param view View instance to remove
     * @param focus Index of the view in the view list (default: -1)
     */
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
    render(): JSX.Element;
}
export {};
