/** ******************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ******************************************************************* */
import * as React from 'react';
import { BaseUtils, NodeUtils, AppContext, GlobalEventHandler } from 'tdp_core';
import { ObjectRefUtils } from 'tdp_core';
import { AView, TDPApplicationUtils, TourUtils } from 'tdp_core';
import { EViewMode } from 'tdp_core';
import { UserSession } from 'tdp_core';
import { ViewWrapper } from './ViewWrapper';
import { CmdUtils } from './cmds';
// eslint-disable-next-line import/no-cycle
import { StartMenuComponent } from './menu/StartMenu';
import { EStartMenuMode, EStartMenuOpen, GraphContext, OrdinoContext } from './constants';
import { OrdinoBreadcrumbs } from './components/navigation';
/**
 * The main class for the Ordino app
 * This class ...
 * - handles the creation, removal, and focus of views
 * - provides a reference to open views
 * - provides a reference to the provenance graph
 */
/**
 * Helper function to filter views that were created: should be moved to NodeUtils
 * @param stateNode
 * @returns {boolean}
 */
function isCreateView(stateNode) {
    const { creator } = stateNode;
    return creator != null && creator.meta.category === ObjectRefUtils.category.visual && creator.meta.operation === ObjectRefUtils.operation.create;
}
export class OrdinoApp extends React.Component {
    constructor(props) {
        super(props);
        this.removeWrapper = (_event, view) => this.remove(view);
        this.chooseNextView = (event, viewId, idtype, selection) => this.handleNextView(event.target, viewId, idtype, selection);
        this.replaceViewInViewWrapper = (_event, _view) => this.updateDetailViewChoosers();
        this.updateSelection = (event, old, newValue) => this.updateItemSelection(event.target, old, newValue);
        this.nodeRef = React.createRef();
        // add OrdinoApp app as (first) object to provenance graph
        // need old name for compatibility
        this.ref = this.props.graph.findOrAddObject(this, 'Targid', ObjectRefUtils.category.visual);
        this.state = {
            mode: EStartMenuMode.START,
            open: EStartMenuOpen.CLOSED,
            views: [],
        };
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
        const index = this.state.views.indexOf(viewWrapper);
        const nextView = this.state.views[index + 1];
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
     * List of open views (e.g., to show in the history)
     */
    get views() {
        return this.state.views;
    }
    get node() {
        return this.nodeRef.current;
    }
    /**
     * The last view of the list of open views
     */
    get lastView() {
        return this.state.views[this.state.views.length - 1];
    }
    /**
     * Set the mode and open/close state of the start menu.
     * Set both options at once to avoid multiple rerender.
     * @param open Open/close state
     * @param mode Overlay/start mode
     */
    setStartMenuState(open, mode) {
        this.setState({
            open,
            mode,
        });
    }
    /**
     * This function can be used to load some initial content async
     */
    async initApp() {
        return null;
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
                // eslint-disable-next-line no-case-declarations
                const index = this.state.views.lastIndexOf(viewWrapper);
                if (index === -1) {
                    console.error('Current view not found:', viewWrapper.desc.name, `(${viewWrapper.desc.id})`);
                    return;
                }
                // eslint-disable-next-line no-case-declarations
                const nextView = this.state.views[index + 1];
                // if there are more views open, then close them first, before replacing the next view
                if (nextView !== this.lastView) {
                    this.remove(this.state.views[index + 2]);
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
        var _a;
        // just update the selection for the last open view
        if (this.lastView === viewWrapper) {
            this.props.graph.pushWithResult(CmdUtils.setSelection(viewWrapper.ref, newSelection.idtype, newSelection.ids), {
                inverse: CmdUtils.setSelection(viewWrapper.ref, oldSelection.idtype, oldSelection.ids),
            });
            // check last view and if it will stay open for the new given selection
        }
        else {
            const i = this.state.views.indexOf(viewWrapper);
            const right = this.state.views[i + 1];
            // update selection with the last open (= right) view
            if (right === this.lastView && right.matchSelectionLength(((_a = newSelection.ids) === null || _a === void 0 ? void 0 : _a.length) || 0)) {
                right.setParameterSelection(newSelection);
                this.props.graph.pushWithResult(CmdUtils.setAndUpdateSelection(viewWrapper.ref, right.ref, newSelection.idtype, newSelection.ids), {
                    inverse: CmdUtils.setAndUpdateSelection(viewWrapper.ref, right.ref, oldSelection.idtype, oldSelection.ids),
                });
                // the selection does not match with the last open (= right) view --> close view
            }
            else {
                this.remove(right);
            }
        }
    }
    push(viewId, idtype, selection, options) {
        // create the first view without changing the focus for the (non existing) previous view
        if (this.state.views.length === 0) {
            return this.pushView(viewId, idtype, selection, options);
        }
        return this.focus(this.state.views[0]).then(() => this.pushView(viewId, idtype, selection, options));
    }
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
    startNewSession(startViewId, startViewOptions, defaultSessionValues = null) {
        // use current emtpy session to start analysis and skip reload to create a new provenance graph
        if (this.props.graph.isEmpty) {
            this.pushStartViewToSession(startViewId, startViewOptions, defaultSessionValues);
            return;
        }
        // store state to session before creating a new graph
        UserSession.getInstance().store(OrdinoApp.SESSION_KEY_START_NEW_SESSION, {
            startViewId,
            startViewOptions,
            defaultSessionValues,
        });
        // create new graph and apply new view after window.reload
        // TODO: The page reload is necessary to update all CLUE user interface.
        //       If CLUE is refactored at some point and the page reload is gone,
        //       we can refactor our session handling here and remove the session storage bypass.
        this.props.graphManager.newGraph();
    }
    /**
     * This function is the counter part to `startNewSession()`.
     * It initializes the new session with the empty provenance graph which is created with the page reload.
     * If initial data is available in the session storage (stored before page reload),
     * it is used to store the default session values into the session storage
     * and push the first view.
     * If no initial data is avaialble the start menu will be opened.
     * If there is a tour hash key in the URL and a tour with the given tour ID is started (if registered).
     */
    initNewSessionAfterPageReload() {
        if (UserSession.getInstance().has(OrdinoApp.SESSION_KEY_START_NEW_SESSION)) {
            const { startViewId, startViewOptions, defaultSessionValues } = UserSession.getInstance().retrieve(OrdinoApp.SESSION_KEY_START_NEW_SESSION);
            this.pushStartViewToSession(startViewId, startViewOptions, defaultSessionValues);
            UserSession.getInstance().remove(OrdinoApp.SESSION_KEY_START_NEW_SESSION);
        }
        else {
            this.setStartMenuState(EStartMenuOpen.OPEN, EStartMenuMode.START);
            // start a tour if a tour ID is passed as URL hash
            if (AppContext.getInstance().hash.has(OrdinoApp.HASH_PROPERTY_START_NEW_TOUR)) {
                const tourId = AppContext.getInstance().hash.getProp(OrdinoApp.HASH_PROPERTY_START_NEW_TOUR);
                // remove hash to avoid starting the tour again after another page load (e.g., starting a new session)
                AppContext.getInstance().hash.removeProp(OrdinoApp.HASH_PROPERTY_START_NEW_TOUR);
                // start selected tour
                TourUtils.startTour(tourId);
            }
        }
    }
    /**
     * Push availabe default session values to provenance graph first.
     * Then push the first view and close the start menu.
     *
     * @param startViewId First view of the analysis session
     * @param startViewOptions Options that are passed to the initial view (e.g. a NamedSet)
     * @param defaultSessionValues Values that are stored in the provenance graph and the session storage
     */
    pushStartViewToSession(startViewId, viewOptions, defaultSessionValues) {
        this.setStartMenuState(EStartMenuOpen.CLOSED, EStartMenuMode.OVERLAY);
        if (defaultSessionValues && Object.keys(defaultSessionValues).length > 0) {
            this.props.graph.push(TDPApplicationUtils.initSession(defaultSessionValues));
        }
        this.push(startViewId, null, null, viewOptions);
    }
    pushView(viewId, idtype, selection, options) {
        return this.props.graph.push(CmdUtils.createView(this.ref, viewId, idtype, selection, options));
    }
    /**
     * Removes a view, and if there are multiple open (following) views, close them in reverse order.
     * @param viewWrapper
     */
    remove(indexOrView) {
        const viewWrapper = typeof indexOrView === 'number' ? this.state.views[indexOrView] : indexOrView;
        const index = this.state.views.indexOf(viewWrapper);
        this.state.views
            .slice(index, this.state.views.length) // retrieve all following views
            .reverse() // remove them in reverse order
            .forEach((view) => {
            // this.remove(d);
            const viewRef = this.props.graph.findObject(view);
            if (viewRef === null) {
                console.warn('remove view:', 'view not found in graph', view ? `'${view.desc.id}'` : view);
                return undefined;
            }
            return this.props.graph.push(CmdUtils.removeView(this.ref, viewRef));
        });
    }
    /**
     * Add a new view wrapper to the list of open views.
     * The return value is index in the list of views.
     * @param view ViewWrapper
     */
    pushImpl(view) {
        view.on(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
        view.on(ViewWrapper.EVENT_CHOOSE_NEXT_VIEW, this.chooseNextView);
        view.on(ViewWrapper.EVENT_REPLACE_VIEW, this.replaceViewInViewWrapper);
        view.on(AView.EVENT_ITEM_SELECT, this.updateSelection);
        view.on(AView.EVENT_UPDATE_ENTRY_POINT, (namedSet) => {
            GlobalEventHandler.getInstance().fire(AView.EVENT_UPDATE_ENTRY_POINT, namedSet);
        });
        this.setState((prevState) => ({ ...prevState, views: [...prevState.views, view] }));
        return BaseUtils.resolveIn(100).then(() => this.focusImpl(this.state.views.length - 1));
    }
    /**
     * Remove the given and focus on the view with the given index.
     * If the focus index is -1 the previous view of the given view will be focused.
     *
     * @param view View instance to remove
     * @param focus Index of the view in the view list (default: -1)
     */
    removeImpl(view, focus = -1) {
        const i = this.state.views.indexOf(view);
        view.off(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
        view.off(ViewWrapper.EVENT_CHOOSE_NEXT_VIEW, this.chooseNextView);
        view.off(ViewWrapper.EVENT_REPLACE_VIEW, this.replaceViewInViewWrapper);
        view.off(AView.EVENT_ITEM_SELECT, this.updateSelection);
        view.off(AView.EVENT_UPDATE_ENTRY_POINT, (namedSet) => {
            GlobalEventHandler.getInstance().fire(AView.EVENT_UPDATE_ENTRY_POINT, namedSet);
        });
        this.setState((prevState) => ({ ...prevState, views: prevState.views.filter((v) => v !== view) }));
        view.destroy();
        // remove with focus change if not already hidden
        if (!Number.isNaN(focus) && view.mode !== EViewMode.HIDDEN) {
            if (focus < 0) {
                focus = i - 1;
            }
            return this.focusImpl(focus);
        }
        return Promise.resolve(NaN);
    }
    replaceView(existingView, viewId, idtype, selection, options) {
        return this.props.graph.push(CmdUtils.replaceView(this.ref, existingView, viewId, idtype, selection, options));
    }
    /**
     * Jumps to a given viewWrapper in the provenance graph
     * @param view
     * @returns {any} Promise
     */
    focus(view) {
        const creators = this.props.graph.act.path.filter(isCreateView).map((d) => d.creator);
        const createdBy = NodeUtils.createdBy(this.props.graph.findOrAddJustObject(view.ref));
        const i = creators.indexOf(createdBy);
        if (i === creators.length - 1) {
            // we are in focus - or should be
            return Promise.resolve(null);
        }
        // jump to the last state this view was in focus
        return this.props.graph.jumpTo(NodeUtils.previous(creators[i + 1]));
    }
    /**
     * Jumps back to the root of the provenance graph and consequentially removes all open views (undo)
     */
    /* focusOnStart() {
      const creators = this.props.graph.act.path.filter((d) => d.creator === null); // null => start StateNode
      if(creators.length > 0) {
        this.props.graph.jumpTo(creators[0]);
      }
    } */
    removeLastImpl() {
        return this.removeImpl(this.state.views[this.state.views.length - 1]);
    }
    showInFocus(d) {
        this.focusImpl(this.state.views.indexOf(d));
    }
    focusImpl(index) {
        let old = -1;
        this.state.views.forEach((v, i) => {
            if (v.mode === EViewMode.FOCUS) {
                old = i;
            }
            let target = EViewMode.HIDDEN;
            if (i === index) {
                target = EViewMode.FOCUS;
            }
            else if (i === index - 1) {
                target = EViewMode.CONTEXT;
            }
            v.mode = target;
        });
        if (old === index) {
            return Promise.resolve(old);
        }
        // TODO: this.setState(); -> triggers rerender
        return BaseUtils.resolveIn(1000).then(() => old);
    }
    /**
     * Update the detail view chooser of each view wrapper,
     * because each view wrapper does not know the surrounding view wrappers.
     *
     * TODO remove/refactor this function when switching the ViewWrapper and its detail view chooser to React
     */
    updateDetailViewChoosers() {
        this.state.views.forEach((view, i) => {
            if (i < this.views.length - 1) {
                view.setActiveNextView(this.views[i + 1].desc.id);
            }
            else {
                view.setActiveNextView(null);
            }
        });
    }
    /**
     * updates the views information, e.g. history
     */
    render() {
        this.updateDetailViewChoosers();
        return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        React.createElement(GraphContext.Provider, { value: { manager: this.props.graphManager, graph: this.props.graph } },
            React.createElement(OrdinoContext.Provider, { value: { app: this } },
                React.createElement(StartMenuComponent, { header: this.props.header, mode: this.state.mode, open: this.state.open }),
                React.createElement(OrdinoBreadcrumbs, { views: this.state.views, onClick: (view) => this.showInFocus(view) }),
                React.createElement("div", { className: "wrapper" },
                    React.createElement("div", { className: "filmstrip", ref: this.nodeRef })))));
    }
}
/**
 * Key for the session storage that is temporarily used when starting a new analysis session
 */
OrdinoApp.SESSION_KEY_START_NEW_SESSION = 'ORDINO_START_NEW_SESSION';
/**
 * Key of the URL hash property that starts a new tour with the given ID (if the tour is registered in a phovea.ts)
 */
OrdinoApp.HASH_PROPERTY_START_NEW_TOUR = 'tour';
//# sourceMappingURL=OrdinoApp.js.map