/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { IObjectRef, ProvenanceGraph } from 'phovea_core';
import 'jquery.scrollto/jquery.scrollTo.js';
import { EventHandler } from 'phovea_core';
import { IPlugin, IPluginDesc } from 'phovea_core';
import { EViewMode, ISelection, IView, IViewContext } from 'tdp_core';
import { IDataProviderDump } from 'lineupjs';
export declare class ViewWrapper extends EventHandler {
    private readonly graph;
    selection: ISelection;
    private plugin;
    private firstTime;
    options?: any;
    static EVENT_CHOOSE_NEXT_VIEW: string;
    static EVENT_FOCUS: string;
    static EVENT_REMOVE: string;
    static EVENT_MODE_CHANGED: string;
    static EVENT_REPLACE_VIEW: string;
    private $viewWrapper;
    private $node;
    private $chooser;
    private _mode;
    private instance;
    /**
     * Listens to the AView.EVENT_ITEM_SELECT event and decided if the chooser should be visible.
     * Then dispatches the incoming event again (aka bubbles up).
     * @param event
     * @param oldSelection
     * @param newSelection
     */
    private listenerItemSelect;
    /**
     * Forward event from view to app instance
     * @param event
     * @param idtype
     * @param namedSet
     */
    private listenerUpdateEntryPoint;
    private dumpChangeTrrack;
    /**
     * Wrapper function for event listener
     */
    private scrollIntoViewListener;
    /**
     * Provenance graph reference of this object
     */
    readonly ref: IObjectRef<ViewWrapper>;
    /**
     * Provenance graph context
     */
    context: IViewContext;
    built: PromiseLike<any>;
    /**
     * Initialize this view, create the root node and the (inner) view
     * @param graph
     * @param selection
     * @param itemSelection
     * @param parent
     * @param plugin
     * @param options
     */
    constructor(graph: ProvenanceGraph, selection: ISelection, itemSelection: ISelection | null, parent: Element, plugin: IPlugin, firstTime: boolean, options?: any);
    /**
     * Create provenance reference object (`this.ref`) and the context (`this.context`)
     * @param graph
     * @param selection
     * @param plugin
     * @param options
     */
    private init;
    /**
     * Create the corresponding DOM elements + chooser and the new (inner) view from the given parameters
     * @param selection
     * @param plugin
     * @param options
     */
    private createView;
    /**
     * Replace the inner view with a new view, created from the given parameters.
     * Note: Destroys all references and DOM elements of the old view, except the root node of this ViewWrapper
     * @param selection
     * @param plugin
     * @param options
     */
    replaceView(selection: ISelection, itemSelection: ISelection | null, plugin: IPlugin, firstTime: boolean, options?: any): PromiseLike<any>;
    /**
     * De-attache the event listener to (inner) view, destroys instance and removes the DOM elements
     */
    private destroyView;
    /**
     * Destroys the inner view and the ViewWrapper's root node
     */
    destroy(): void;
    getInstance(): IView;
    restoreDump(dump: IDataProviderDump): void;
    private onParameterChange;
    getParameter(name: string): any;
    setParameterImpl(name: string, value: any): void;
    getItemSelection(): ISelection;
    setItemSelection(sel: ISelection): PromiseLike<void>;
    setParameterSelection(selection: ISelection): PromiseLike<void>;
    getParameterSelection(): ISelection;
    matchSelectionLength(length: number): boolean;
    set mode(mode: EViewMode);
    protected modeChanged(mode: EViewMode): void;
    private updateAfterAnimation;
    private scrollIntoView;
    /**
     * Decide if a chooser for the next view should be shown and if so, which next views are available
     * @param idtype
     * @param range
     */
    private chooseNextViews;
    setActiveNextView(viewId?: string): void;
    get desc(): import("tdp_core").IViewPluginDesc;
    get mode(): EViewMode;
    get node(): Element;
    remove(): void;
    focus(): void;
    static createViewWrapper(graph: ProvenanceGraph, selection: ISelection, itemSelection: ISelection | null, parent: Element, plugin: IPluginDesc, firstTime: boolean, options?: any): Promise<ViewWrapper>;
    static replaceViewWrapper(existingView: ViewWrapper, selection: ISelection, itemSelection: ISelection | null, plugin: IPluginDesc, firstTime: boolean, options?: any): Promise<any>;
}
