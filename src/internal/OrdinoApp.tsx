/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/

import * as React from 'react';
import {BaseUtils, NodeUtils, ICmdResult, AppContext, IPluginDesc} from 'phovea_core';
import {IObjectRef, ObjectRefUtils, ProvenanceGraph, StateNode, IDType, IEvent} from 'phovea_core';
import {AView, IViewPluginDesc, TDPApplicationUtils, TourUtils, ViewUtils} from 'tdp_core';
import {EViewMode, ISelection} from 'tdp_core';
import {ViewWrapper} from 'tdp_core';
import {CLUEGraphManager} from 'phovea_clue';
import {CmdUtils} from './cmds';
import {Range} from 'phovea_core';
import {UserSession} from 'phovea_core';
import {IOrdinoApp} from './IOrdinoApp';
import {EStartMenuMode, EStartMenuOpen, StartMenuComponent} from './menu/StartMenu';
import {AppHeader} from 'phovea_ui';
import {OrdinoBreadcrumbs} from './components/navigation';
import {OrdinoViewWrapper} from './OrdinoViewWrapper';
import {Chooser} from './Chooser';

// tslint:disable-next-line: variable-name
export const OrdinoContext = React.createContext<{app: IOrdinoApp}>({app: null});

// tslint:disable-next-line: variable-name
export const GraphContext = React.createContext<{graph: ProvenanceGraph, manager: CLUEGraphManager}>({graph: null, manager: null});

// tslint:disable-next-line: variable-name
export const HighlightSessionCardContext = React.createContext<{highlight: boolean, setHighlight: React.Dispatch<React.SetStateAction<boolean>>}>({highlight: false, setHighlight: () => { /* dummy function */}});

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
export class OrdinoApp extends React.Component<IOrdinoAppProps, IOrdinoAppState> implements IOrdinoApp {
  /**
   * Key for the session storage that is temporarily used when starting a new analysis session
   */
  private static SESSION_KEY_START_NEW_SESSION = 'ORDINO_START_NEW_SESSION';

  /**
   * Key of the URL hash property that starts a new tour with the given ID (if the tour is registered in a phovea.ts)
   */
  private static HASH_PROPERTY_START_NEW_TOUR = 'tour';

  /**
   * IObjectRef to this OrdinoApp instance
   * @type {IObjectRef<OrdinoApp>}
   */
  readonly ref: IObjectRef<OrdinoApp>;

  /**
   * React DOM node reference
   */
  private readonly nodeRef: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);

    this.nodeRef = React.createRef();

    // add OrdinoApp app as (first) object to provenance graph
    // need old name for compatibility
    this.ref = this.props.graph.findOrAddObject(this, 'Targid', ObjectRefUtils.category.visual);

    this.state = {
      mode: EStartMenuMode.START,
      open: EStartMenuOpen.CLOSED,
      views: []
    };
  }

  /**
   * This function can be used to load some initial content async
   */
  async initApp() {
    return null;
  }

  /**
   * Set the mode and open/close state of the start menu.
   * Set both options at once to avoid multiple rerender.
   * @param open Open/close state
   * @param mode Overlay/start mode
   */
  setStartMenuState(open: EStartMenuOpen, mode: EStartMenuMode) {
    this.setState({
      open,
      mode
    });
  }

  /**
   * List of open views (e.g., to show in the history)
   */
  get views(): ViewWrapper[] {
    return this.state.views;
  }

  get node() {
    return this.nodeRef.current;
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
  private handleNextView = (openViewWrapper: ViewWrapper, viewId: string, idtype: IDType, selection: Range, options?) => {
    const index = this.state.views.indexOf(openViewWrapper);

    // close instead of "re-open" the same view again
    if (this.lastView.plugin.id === viewId) {
      return;

      // open or replace the new view to the right
    } else {
      this.openOrReplaceNextView(openViewWrapper, viewId, idtype, selection, options);
    }
  }

  /**
   * Opens a new view using the viewId, idtype, selection and options.
   *
   * Linear history with replace action (instead of dedicated remove/add action):
   * - Reuses the old viewWrapper, but creates a new child view inside
   * - Branches are only created for non-focus/context views (that triggered the open event)
   *
   * @param viewWrapper The view that triggered the opener event.
   * @param viewId The new view that should be opened to the right.
   * @param idtype
   * @param selection
   * @param options
   */
  private openOrReplaceNextView(viewWrapper: ViewWrapper, viewId: string, idtype: IDType, selection: Range, options?) {
    // the opener is the last view, then nothing to replace --> just open the new view
    if (this.lastView === viewWrapper) {
      this.pushView(viewId, idtype, selection, options);
      return;
    }

    // find the next view
    const index = this.state.views.lastIndexOf(viewWrapper);
    if (index === -1) {
      console.error('Current view not found:', viewWrapper.plugin.name, `(${viewWrapper.plugin.id})`);
      return;
    }

    const nextView = this.state.views[index + 1];
    // if there are more views open, then close them first, before replacing the next view
    if (nextView !== this.lastView) {
      this.remove(this.state.views[index + 2]);
    }

    // trigger the replacement of the view
    this.replaceView(nextView.ref, viewId, idtype, selection, options);
  }

  /**
   * Sets the new given item selection to the last open view and stores an action in the provenance graph.
   * @param viewWrapper
   * @param oldSelection
   * @param newSelection
   * @param options
   */
  private updateItemSelection = (viewWrapper: ViewWrapper, oldSelection: ISelection, newSelection: ISelection, options?) => {
    // just update the selection for the last open view
    if (this.lastView === viewWrapper) {
      this.props.graph.pushWithResult(CmdUtils.setSelection(viewWrapper.ref, newSelection.idtype, newSelection.range), {inverse: CmdUtils.setSelection(viewWrapper.ref, oldSelection.idtype, oldSelection.range)});
      // check last view and if it will stay open for the new given selection
    } else {

      const i = this.state.views.indexOf(viewWrapper);
      const right = this.state.views[i + 1];

      // TODO: add this method to the tdp_core wrapper
      const matchSelectionLength = (wrapper: ViewWrapper, length: number) => {
        return ViewUtils.matchLength(wrapper.plugin.selection, length) || (ViewUtils.showAsSmallMultiple(wrapper.plugin) && length > 1);
      };

      // update selection with the last open (= right) view
      if (right === this.lastView && matchSelectionLength(right, newSelection.range.dim(0).length)) {
        right.setInputSelection(newSelection);
        this.props.graph.pushWithResult(CmdUtils.setAndUpdateSelection(viewWrapper.ref, right.ref, newSelection.idtype, newSelection.range), {inverse: CmdUtils.setAndUpdateSelection(viewWrapper.ref, right.ref, oldSelection.idtype, oldSelection.range)});

        // the selection does not match with the last open (= right) view --> close view
      } else {
        this.remove(right);
      }
    }
  }

  /**
   * The last view of the list of open views
   */
  get lastView(): ViewWrapper {
    return this.state.views[this.state.views.length - 1];
  }

  push(viewId: string, idtype: IDType, selection: Range, options?) {
    // create the first view without changing the focus for the (non existing) previous view
    if (this.state.views.length === 0) {
      return this.pushView(viewId, idtype, selection, options);

    } else {
      return this.focus(this.state.views[0]).then(() => this.pushView(viewId, idtype, selection, options));
    }
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
  startNewSession(startViewId: string, startViewOptions: any, defaultSessionValues: any = null) {
    // use current emtpy session to start analysis and skip reload to create a new provenance graph
    if (this.props.graph.isEmpty) {
      this.pushStartViewToSession(startViewId, startViewOptions, defaultSessionValues);
      return;
    }

    // store state to session before creating a new graph
    UserSession.getInstance().store(OrdinoApp.SESSION_KEY_START_NEW_SESSION, {
      startViewId,
      startViewOptions,
      defaultSessionValues
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
      const {startViewId, startViewOptions, defaultSessionValues} = UserSession.getInstance().retrieve(OrdinoApp.SESSION_KEY_START_NEW_SESSION);

      this.pushStartViewToSession(startViewId, startViewOptions, defaultSessionValues);

      UserSession.getInstance().remove(OrdinoApp.SESSION_KEY_START_NEW_SESSION);

    } else {
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
   * Push available default session values to provenance graph first.
   * Then push the first view and close the start menu.
   *
   * @param startViewId First view of the analysis session
   * @param startViewOptions Options that are passed to the initial view (e.g. a NamedSet)
   * @param defaultSessionValues Values that are stored in the provenance graph and the session storage
   */
  private pushStartViewToSession(startViewId, viewOptions, defaultSessionValues?) {
    this.setStartMenuState(EStartMenuOpen.CLOSED, EStartMenuMode.OVERLAY);

    if (defaultSessionValues && Object.keys(defaultSessionValues).length > 0) {
      this.props.graph.push(TDPApplicationUtils.initSession(defaultSessionValues));
    }

    this.push(startViewId, null, null, viewOptions);
  }

  private pushView(viewId: string, idtype: IDType, selection: Range, options?) {
    return this.props.graph.push(CmdUtils.createView(this.ref, viewId, idtype, selection, options));
  }

  /**
   * Removes a view, and if there are multiple open (following) views, close them in reverse order.
   * @param viewWrapper
   */
  private remove(indexOrView: number | ViewWrapper) {
    const viewWrapper = typeof indexOrView === 'number' ? this.state.views[indexOrView as number] : indexOrView as ViewWrapper;
    const index = this.state.views.indexOf(viewWrapper);

    this.state.views
      .slice(index, this.state.views.length) // retrieve all following views
      .reverse() // remove them in reverse order
      .forEach((view) => {
        //this.remove(d);
        const viewRef = this.props.graph.findObject(view);
        if (viewRef === null) {
          console.warn('remove view:', 'view not found in graph', (view ? `'${view.plugin.id}'` : view));
          return;
        }
        return this.props.graph.push(CmdUtils.removeView(this.ref, viewRef));
      });
  }

  /**
   * Add a new view wrapper to the list of open views.
   * The return value is index in the list of views.
   * @param view ViewWrapper
   */
  async pushImpl(view: ViewWrapper) {
    await new Promise<ViewWrapper>((resolve) => {
      this.setState({
        views: [...this.state.views, view]
      });
      view.on(ViewWrapper.EVENT_VIEW_INITIALIZED, () => resolve(view));
    });

    return BaseUtils.resolveIn(100).then(() => this.focusImpl(this.state.views.length - 1));
  }

  /**
   * Remove the given and focus on the view with the given index.
   * If the focus index is -1 the previous view of the given view will be focused.
   *
   * @param view View instance to remove
   * @param focus Index of the view in the view list (default: -1)
   */
  removeImpl(view: ViewWrapper, focus: number = -1) {
    const i = this.state.views.indexOf(view);
    // view.off(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
    // view.off(ViewWrapper.EVENT_CHOOSE_NEXT_VIEW, this.chooseNextView);
    // view.off(ViewWrapper.EVENT_REPLACE_VIEW, this.replaceViewInViewWrapper);
    // view.off(AView.EVENT_ITEM_SELECT, this.updateSelection);

    this.setState({
      views: this.state.views.filter((v) => v !== view)
    });

    // view.destroy();
    // //remove with focus change if not already hidden
    // if (!isNaN(focus) && view.mode !== EViewMode.HIDDEN) {
    //   if (focus < 0) {
    //     focus = i - 1;
    //   }
    //   return this.focusImpl(focus);
    // }

    return Promise.resolve(NaN);
  }

  private replaceView(existingView: IObjectRef<ViewWrapper>, viewId: string, idtype: IDType, selection: Range, options?): Promise<ICmdResult> {

    return this.props.graph.push(CmdUtils.replaceView(this.ref, existingView, viewId, idtype, selection, options));
  }

  async replaceImpl(existingView: ViewWrapper, nextView: ViewWrapper) {
    await new Promise<ViewWrapper>((resolve) => {
      this.setState(({views}) => {
        const index = views.indexOf(existingView);
        views.splice(index, 1, nextView);
        return {views};
      });
      nextView.on(ViewWrapper.EVENT_VIEW_INITIALIZED, () => resolve(nextView));
    });
    return BaseUtils.resolveIn(100).then(() => this.focusImpl(this.state.views.length - 1));
  }

  /**
   * Jumps to a given viewWrapper in the provenance graph
   * @param view
   * @returns {any} Promise
   */
  focus(view: ViewWrapper) {
    const creators = this.props.graph.act.path.filter(isCreateView).map((d) => d.creator);
    const createdBy = NodeUtils.createdBy(this.props.graph.findOrAddJustObject(view.ref));
    const i = creators.indexOf(createdBy);
    if (i === (creators.length - 1)) {
      //we are in focus - or should be
      return Promise.resolve(null);
    } else {
      //jump to the last state this view was in focus
      return this.props.graph.jumpTo(NodeUtils.previous(creators[i + 1]));
    }
  }

  /**
   * Jumps back to the root of the provenance graph and consequentially removes all open views (undo)
   */

  /*focusOnStart() {
    const creators = this.props.graph.act.path.filter((d) => d.creator === null); // null => start StateNode
    if(creators.length > 0) {
      this.props.graph.jumpTo(creators[0]);
    }
  }*/

  removeLastImpl() {
    return this.removeImpl(this.state.views[this.state.views.length - 1]);
  }

  showInFocus(d: ViewWrapper) {
    this.focusImpl(this.state.views.indexOf(d));
  }

  focusImpl(index: number) {
    let old = -1;
    this.state.views.forEach((v, i) => {
      if (v.mode === EViewMode.FOCUS) {
        old = i;
      }
      let target = EViewMode.HIDDEN;
      if (i === index) {
        target = EViewMode.FOCUS;
      } else if (i === (index - 1)) {
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
   * updates the views information, e.g. history
   */
  render() {

    return (
      <>
        <GraphContext.Provider value={{manager: this.props.graphManager, graph: this.props.graph}}>
          <OrdinoContext.Provider value={{app: this}}>
            <StartMenuComponent header={this.props.header} mode={this.state.mode} open={this.state.open}></StartMenuComponent>
            <OrdinoBreadcrumbs views={this.state.views} onClick={(view) => this.showInFocus(view)}></OrdinoBreadcrumbs>
            <div className="wrapper">
              <div className="filmstrip" ref={this.nodeRef}>
                {this.state.views.map((v, i) => {
                  const viewCount = this.state.views.length;
                  const isLastView = this.state.views.indexOf(v) === viewCount - 1;
                  const previousView = this.state.views[i - 1];
                  return <React.Fragment key={v.plugin.id}>
                    <OrdinoViewWrapper
                      key={v.plugin.id}
                      graph={this.props.graph}
                      wrapper={v}
                      onSelectionChanged={this.updateItemSelection}
                    >
                      {i > 0 && <Chooser previousWrapper={previousView} onOpenView={this.handleNextView} />}
                    </OrdinoViewWrapper>

                    {isLastView &&
                      <Chooser previousWrapper={v} onOpenView={this.handleNextView} />}
                  </React.Fragment>;
                })}
              </div>
            </div>
          </OrdinoContext.Provider>
        </GraphContext.Provider>
      </>
    );
  }
}

/**
 * Helper function to filter views that were created: should be moved to NodeUtils
 * @param stateNode
 * @returns {boolean}
 */
function isCreateView(stateNode: StateNode) {
  const creator = stateNode.creator;
  return creator != null && creator.meta.category === ObjectRefUtils.category.visual && creator.meta.operation === ObjectRefUtils.operation.create;
}


export function createViewWrapper(graph: ProvenanceGraph, selection: ISelection, itemSelection: ISelection | null, parent: Element, plugin: IViewPluginDesc, firstTime: boolean, options?: unknown) {
  const wrapper = new ViewWrapper(plugin, graph, parent.ownerDocument, () => options);
  wrapper.setInputSelection(selection);
  wrapper.visible = true;
  wrapper.node.classList.add('active');
  return wrapper;
}
