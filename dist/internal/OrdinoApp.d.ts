/** ******************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ******************************************************************* */
import * as React from 'react';
import { ICmdResult } from 'tdp_core';
import { IObjectRef, ProvenanceGraph, IDType } from 'tdp_core';
import { CLUEGraphManager } from 'tdp_core';
import { AppHeader } from 'tdp_core';
import { ViewWrapper } from './ViewWrapper';
import { IOrdinoApp } from './IOrdinoApp';
import { EStartMenuMode, EStartMenuOpen } from './constants';
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
export declare class OrdinoApp extends React.Component<IOrdinoAppProps, IOrdinoAppState> implements IOrdinoApp {
    /**
     * Key for the session storage that is temporarily used when starting a new analysis session
     */
    private static SESSION_KEY_START_NEW_SESSION;
    /**
     * Key of the URL hash property that starts a new tour with the given ID (if the tour is registered in a phovea.ts)
     */
    private static HASH_PROPERTY_START_NEW_TOUR;
    /**
     * IObjectRef to this OrdinoApp instance
     * @type {IObjectRef<OrdinoApp>}
     */
    readonly ref: IObjectRef<OrdinoApp>;
    /**
     * React DOM node reference
     */
    private readonly nodeRef;
    constructor(props: any);
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
     * List of open views (e.g., to show in the history)
     */
    get views(): ViewWrapper[];
    get node(): HTMLDivElement;
    /**
     * The last view of the list of open views
     */
    get lastView(): ViewWrapper;
    /**
     * Set the mode and open/close state of the start menu.
     * Set both options at once to avoid multiple rerender.
     * @param open Open/close state
     * @param mode Overlay/start mode
     */
    setStartMenuState(open: EStartMenuOpen, mode: EStartMenuMode): void;
    private readonly removeWrapper;
    private readonly chooseNextView;
    private readonly replaceViewInViewWrapper;
    private readonly updateSelection;
    private readonly entryPointChanged;
    /**
     * This function can be used to load some initial content async
     */
    initApp(): Promise<any>;
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
    push(viewId: string, idtype: IDType, selection: string[], options?: any): PromiseLike<ICmdResult>;
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
    startNewSession(startViewId: string, startViewOptions: Record<string, any>, defaultSessionValues?: Record<string, any>): void;
    /**
     * This function is the counter part to `startNewSession()`.
     * It initializes the new session with the empty provenance graph which is created with the page reload.
     * If initial data is available in the session storage (stored before page reload),
     * it is used to store the default session values into the session storage
     * and push the first view.
     * If no initial data is avaialble the start menu will be opened.
     * If there is a tour hash key in the URL and a tour with the given tour ID is started (if registered).
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
     * Update the detail view chooser of each view wrapper,
     * because each view wrapper does not know the surrounding view wrappers.
     *
     * TODO remove/refactor this function when switching the ViewWrapper and its detail view chooser to React
     */
    private updateDetailViewChoosers;
    /**
     * updates the views information, e.g. history
     */
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=OrdinoApp.d.ts.map