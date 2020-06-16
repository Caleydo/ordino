/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { BaseUtils, NodeUtils } from 'phovea_core';
import { ObjectRefUtils } from 'phovea_core';
import { EventHandler } from 'phovea_core';
import * as d3 from 'd3';
import { AView } from 'tdp_core';
import { EViewMode } from 'tdp_core';
import { ViewWrapper } from './ViewWrapper';
import { CmdUtils } from './cmds';
import { SESSION_KEY_NEW_ENTRY_POINT } from './constants';
import { UserSession } from 'phovea_core';
import { PluginRegistry } from 'phovea_core';
export const EXTENSION_POINT_WELCOME_PAGE = 'ordinoWelcomeView';
/**
 * The main class for the Ordino app
 * This class ...
 * - handles the creation, removal, and focus of views
 * - provides a reference to open views
 * - provides a reference to the provenance graph
 */
export class OrdinoApp extends EventHandler {
    constructor(graph, graphManager, parent) {
        super();
        this.graph = graph;
        this.graphManager = graphManager;
        /**
         * List of open views (e.g., to show in the history)
         * @type {ViewWrapper[]}
         */
        this.views = [];
        this.removeWrapper = (event, view) => this.remove(view);
        this.chooseNextView = (event, viewId, idtype, selection) => this.handleNextView(event.target, viewId, idtype, selection);
        this.updateSelection = (event, old, newValue) => this.updateItemSelection(event.target, old, newValue);
        // add OrdinoApp app as (first) object to provenance graph
        // need old name for compatibility
        this.ref = graph.findOrAddObject(this, 'Targid', ObjectRefUtils.category.visual);
        this.$history = this.buildHistory(parent);
        const $wrapper = d3.select(parent).append('div').classed('wrapper', true);
        this.$node = $wrapper.append('div').classed('targid', true).datum(this);
        this.buildWelcomeView(this.$node.node());
    }
    /**
     * Loads registered welcome pages from the extension points.
     * The welcome page with the highest priority is loaded and shown.
     *
     * @param {HTMLElement} parent
     */
    buildWelcomeView(parent) {
        const welcomeViews = PluginRegistry.getInstance().listPlugins(EXTENSION_POINT_WELCOME_PAGE)
            .sort((a, b) => ((b.priority || 10) - (a.priority || 10))); // descending
        if (welcomeViews.length === 0) {
            console.warn('No registered welcome page found!');
            return;
        }
        welcomeViews[0].load()
            .then((p) => {
            const welcomeView = p.factory(parent);
            welcomeView.build();
        });
    }
    buildHistory(parent) {
        const $history = d3.select(parent).append('ul').classed('tdp-button-group history', true);
        $history.append('li').classed('homeButton', true)
            .html(`<a href="#">
        <i class="fa fa-home" aria-hidden="true"></i>
        <span class="sr-only">Start</span>
      </a>`);
        $history.select('.homeButton > a').on('click', (d) => {
            // prevent changing the hash (href)
            d3.event.preventDefault();
            this.fire(OrdinoApp.EVENT_OPEN_START_MENU);
        });
        return $history;
    }
    get node() {
        return this.$node.node();
    }
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
    handleNextView(viewWrapper, viewId, idtype, selection, options) {
        const index = this.views.indexOf(viewWrapper);
        const nextView = this.views[index + 1];
        // close instead of "re-open" the same view again
        if (nextView !== undefined && nextView.desc.id === viewId) {
            this.remove(nextView);
            // open or replace the new view to the right
        }
        else {
            this.openOrReplaceNextView(viewWrapper, viewId, idtype, selection, options);
        }
    }
    /**
     * Opens a new view using the viewId, idtype, selection and options.
     *
     * @param viewWrapper The view that triggered the opener event.
     * @param viewId The new view that should be opened to the right.
     * @param idtype
     * @param selection
     * @param options
     */
    openOrReplaceNextView(viewWrapper, viewId, idtype, selection, options) {
        const mode = 2; // select opener mode
        switch (mode) {
            /**
             * Branch for every new detail view:
             * - Focus on view that triggered the open event --> jumps back in provenance graph
             * - Then branch the provenance graph with a new open view and set the old selection to the opener view
             */
            // case 0:
            //   // first focus, then push the view
            //   this.focus(viewWrapper).then(() => {
            //     this.pushView(viewId, idtype, selection, options);
            //     viewWrapper.setItemSelection({idtype, range:selection});
            //   });
            //
            //   break;
            /**
             * Linear history with remove and add action:
             * - Remove the old view --> new remove action in provenance graph
             * - Add the new view --> new add action in provenance graph
             * - Branches are only created for non-focus/context views (that triggered the open event)
             */
            // case 1:
            //   // remove old views first, if the opener is not the last view
            //   if(this.lastView !== viewWrapper) {
            //     this.remove(this.lastView);
            //   }
            //   // then push the new view
            //   this.pushView(viewId, idtype, selection, options);
            //
            //   break;
            /**
             * Linear history with replace action (instead of dedicated remove/add action):
             * - Reuses the old viewWrapper, but creates a new child view inside
             * - Branches are only created for non-focus/context views (that triggered the open event)
             */
            case 2:
                // the opener is the last view, then nothing to replace --> just open the new view
                if (this.lastView === viewWrapper) {
                    this.pushView(viewId, idtype, selection, options);
                    break;
                }
                // find the next view
                const index = this.views.lastIndexOf(viewWrapper);
                if (index === -1) {
                    console.error('Current view not found:', viewWrapper.desc.name, `(${viewWrapper.desc.id})`);
                    return;
                }
                const nextView = this.views[index + 1];
                // if there are more views open, then close them first, before replacing the next view
                if (nextView !== this.lastView) {
                    this.remove(this.views[index + 2]);
                }
                // trigger the replacement of the view
                this.replaceView(nextView.ref, viewId, idtype, selection, options);
                break;
            default:
                console.error('No mode for opening new views selected!');
        }
    }
    /**
     * Sets the new given item selection to the last open view and stores an action in the provenance graph.
     * @param viewWrapper
     * @param oldSelection
     * @param newSelection
     * @param options
     */
    updateItemSelection(viewWrapper, oldSelection, newSelection, options) {
        // just update the selection for the last open view
        if (this.lastView === viewWrapper) {
            this.graph.pushWithResult(CmdUtils.setSelection(viewWrapper.ref, newSelection.idtype, newSelection.range), { inverse: CmdUtils.setSelection(viewWrapper.ref, oldSelection.idtype, oldSelection.range) });
            // check last view and if it will stay open for the new given selection
        }
        else {
            const i = this.views.indexOf(viewWrapper);
            const right = this.views[i + 1];
            // update selection with the last open (= right) view
            if (right === this.lastView && right.matchSelectionLength(newSelection.range.dim(0).length)) {
                right.setParameterSelection(newSelection);
                this.graph.pushWithResult(CmdUtils.setAndUpdateSelection(viewWrapper.ref, right.ref, newSelection.idtype, newSelection.range), { inverse: CmdUtils.setAndUpdateSelection(viewWrapper.ref, right.ref, oldSelection.idtype, oldSelection.range) });
                // the selection does not match with the last open (= right) view --> close view
            }
            else {
                this.remove(right);
            }
        }
    }
    get lastView() {
        return this.views[this.views.length - 1];
    }
    push(viewId, idtype, selection, options) {
        // create the first view without changing the focus for the (non existing) previous view
        if (this.views.length === 0) {
            return this.pushView(viewId, idtype, selection, options);
        }
        else {
            return this.focus(this.views[0]).then(() => this.pushView(viewId, idtype, selection, options));
        }
    }
    initNewSession(view, options, defaultSessionValues = null) {
        // store state to session before creating a new graph
        UserSession.getInstance().store(SESSION_KEY_NEW_ENTRY_POINT, {
            view,
            options,
            defaultSessionValues
        });
        // create new graph and apply new view after window.reload (@see targid.checkForNewEntryPoint())
        this.graphManager.newGraph();
    }
    pushView(viewId, idtype, selection, options) {
        return this.graph.push(CmdUtils.createView(this.ref, viewId, idtype, selection, options));
    }
    /**
     * Removes a view, and if there are multiple open (following) views, close them in reverse order.
     * @param viewWrapper
     */
    remove(indexOrView) {
        const viewWrapper = typeof indexOrView === 'number' ? this.views[indexOrView] : indexOrView;
        const index = this.views.indexOf(viewWrapper);
        this.views
            .slice(index, this.views.length) // retrieve all following views
            .reverse() // remove them in reverse order
            .forEach((view) => {
            //this.remove(d);
            const viewRef = this.graph.findObject(view);
            if (viewRef === null) {
                console.warn('remove view:', 'view not found in graph', (view ? `'${view.desc.id}'` : view));
                return;
            }
            return this.graph.push(CmdUtils.removeView(this.ref, viewRef));
        });
        // no views available, then open start menu
        if (index === 0) {
            this.fire('openStartMenu');
        }
    }
    pushImpl(view) {
        view.on(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
        view.on(ViewWrapper.EVENT_CHOOSE_NEXT_VIEW, this.chooseNextView);
        view.on(AView.EVENT_ITEM_SELECT, this.updateSelection);
        this.propagate(view, AView.EVENT_UPDATE_ENTRY_POINT);
        this.views.push(view);
        this.update();
        return BaseUtils.resolveIn(100).then(() => this.focusImpl(this.views.length - 1));
    }
    removeImpl(view, focus = -1) {
        const i = this.views.indexOf(view);
        view.off(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
        view.off(ViewWrapper.EVENT_CHOOSE_NEXT_VIEW, this.chooseNextView);
        view.off(AView.EVENT_ITEM_SELECT, this.updateSelection);
        this.views.splice(i, 1);
        this.update();
        view.destroy();
        //remove with focus change if not already hidden
        if (!isNaN(focus) && view.mode !== EViewMode.HIDDEN) {
            if (focus < 0) {
                focus = i - 1;
            }
            return this.focusImpl(focus);
        }
        return Promise.resolve(NaN);
    }
    replaceView(existingView, viewId, idtype, selection, options) {
        return this.graph.push(CmdUtils.replaceView(this.ref, existingView, viewId, idtype, selection, options))
            .then((r) => {
            this.update();
            return r;
        });
    }
    /**
     * Jumps to a given viewWrapper in the provenance graph
     * @param view
     * @returns {any} Promise
     */
    focus(view) {
        const creators = this.graph.act.path.filter(isCreateView).map((d) => d.creator);
        const createdBy = NodeUtils.createdBy(this.graph.findOrAddJustObject(view.ref));
        const i = creators.indexOf(createdBy);
        if (i === (creators.length - 1)) {
            //we are in focus - or should be
            return Promise.resolve(null);
        }
        else {
            //jump to the last state this view was in focus
            return this.graph.jumpTo(NodeUtils.previous(creators[i + 1]));
        }
    }
    /**
     * Jumps back to the root of the provenance graph and consequentially removes all open views (undo)
     */
    /*focusOnStart() {
      const creators = this.graph.act.path.filter((d) => d.creator === null); // null => start StateNode
      if(creators.length > 0) {
        this.graph.jumpTo(creators[0]);
      }
    }*/
    removeLastImpl() {
        return this.removeImpl(this.views[this.views.length - 1]);
    }
    showInFocus(d) {
        this.focusImpl(this.views.indexOf(d));
    }
    focusImpl(index) {
        let old = -1;
        this.views.forEach((v, i) => {
            if (v.mode === EViewMode.FOCUS) {
                old = i;
            }
            let target = EViewMode.HIDDEN;
            if (i === index) {
                target = EViewMode.FOCUS;
            }
            else if (i === (index - 1)) {
                target = EViewMode.CONTEXT;
            }
            v.mode = target;
        });
        if (old === index) {
            return Promise.resolve(old);
        }
        this.update();
        return BaseUtils.resolveIn(1000).then(() => old);
    }
    /**
     * updates the views information, e.g. history
     */
    update() {
        const $views = this.$history.selectAll('li.hview').data(this.views);
        $views.enter()
            .append('li').classed('hview', true)
            .append('a').attr('href', '#')
            .on('click', (d) => {
            d3.event.preventDefault();
            this.showInFocus(d);
        });
        $views
            .classed('t-context', (d) => d.mode === EViewMode.CONTEXT)
            .classed('t-hide', (d) => d.mode === EViewMode.HIDDEN)
            .classed('t-focus', (d) => d.mode === EViewMode.FOCUS)
            .select('a').text((d) => d.desc.name);
        $views.exit().remove();
        //notify views which next view is chosen
        this.views.forEach((view, i) => {
            if (i < this.views.length - 1) {
                view.setActiveNextView(this.views[i + 1].desc.id);
            }
            else {
                view.setActiveNextView(null);
            }
        });
    }
}
OrdinoApp.EVENT_OPEN_START_MENU = 'openStartMenu';
/**
 * Helper function to filter views that were created: should be moved to NodeUtils
 * @param stateNode
 * @returns {boolean}
 */
function isCreateView(stateNode) {
    const creator = stateNode.creator;
    return creator != null && creator.meta.category === ObjectRefUtils.category.visual && creator.meta.operation === ObjectRefUtils.operation.create;
}
//# sourceMappingURL=OrdinoApp.js.map