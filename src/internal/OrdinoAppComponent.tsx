/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/

import * as React from 'react';
import {BaseUtils, NodeUtils, ICmdResult} from 'phovea_core';
import {IObjectRef, ObjectRefUtils, ProvenanceGraph, StateNode, IDType, IEvent} from 'phovea_core';
import {AView} from 'tdp_core';
import {EViewMode, ISelection} from 'tdp_core';
import {ViewWrapper} from './ViewWrapper';
import {CLUEGraphManager} from 'phovea_clue';
import {CmdUtils} from './cmds';
import {Range} from 'phovea_core';
import {SESSION_KEY_NEW_ENTRY_POINT} from './constants';
import {UserSession} from 'phovea_core';
import { IOrdinoApp } from './IOrdinoApp';
import {EStartMenuMode, StartMenuComponent} from './menu/StartMenuReact';
import {AppHeader} from 'phovea_ui';

// tslint:disable-next-line: variable-name
export const OrdinoContext = React.createContext<{app: IOrdinoApp}>({app: null});

interface IOrdinoAppComponentProps {
  graph: ProvenanceGraph;
  graphManager: CLUEGraphManager;
  header: AppHeader;
}

interface IOrdinoAppComponentState {
  mode: EStartMenuMode;
  views: ViewWrapper[];
}

/**
 * The main class for the Ordino app
 * This class ...
 * - handles the creation, removal, and focus of views
 * - provides a reference to open views
 * - provides a reference to the provenance graph
 */
export class OrdinoAppComponent extends React.Component<IOrdinoAppComponentProps, IOrdinoAppComponentState> implements IOrdinoApp  {
  /**
   * IObjectRef to this OrdinoApp instance
   * @type {IObjectRef<OrdinoApp>}
   */
  readonly ref: IObjectRef<OrdinoAppComponent>;

  /**
   * React DOM node reference
   */
  private readonly nodeRef: React.RefObject<Element>;

  private readonly removeWrapper = (event: any, view: ViewWrapper) => this.remove(view);
  private readonly chooseNextView = (event: IEvent, viewId: string, idtype: IDType, selection: Range) => this.handleNextView(event.target as ViewWrapper, viewId, idtype, selection);
  private readonly updateSelection = (event: IEvent, old: ISelection, newValue: ISelection) => this.updateItemSelection(event.target as ViewWrapper, old, newValue);

  constructor(props) {
    super(props);

    this.nodeRef = React.createRef();

    // add OrdinoApp app as (first) object to provenance graph
    // need old name for compatibility
    this.ref = this.props.graph.findOrAddObject(this, 'Targid', ObjectRefUtils.category.visual);

    this.state = {
      mode: EStartMenuMode.START,
      views: []
    };
  }

  async initApp() {
    // this function can be used to load some initial content async
    return null;
  }

  setStartMenuMode(mode: EStartMenuMode) {
    this.setState({
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
  private handleNextView(viewWrapper: ViewWrapper, viewId: string, idtype: IDType, selection: Range, options?) {
    const index = this.state.views.indexOf(viewWrapper);
    const nextView = this.state.views[index + 1];

    // close instead of "re-open" the same view again
    if (nextView !== undefined && nextView.desc.id === viewId) {
      this.remove(nextView);

      // open or replace the new view to the right
    } else {
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
  private openOrReplaceNextView(viewWrapper: ViewWrapper, viewId: string, idtype: IDType, selection: Range, options?) {
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
        const index = this.state.views.lastIndexOf(viewWrapper);
        if (index === -1) {
          console.error('Current view not found:', viewWrapper.desc.name, `(${viewWrapper.desc.id})`);
          return;
        }
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
  private updateItemSelection(viewWrapper: ViewWrapper, oldSelection: ISelection, newSelection: ISelection, options?) {
    // just update the selection for the last open view
    if (this.lastView === viewWrapper) {
      this.props.graph.pushWithResult(CmdUtils.setSelection(viewWrapper.ref, newSelection.idtype, newSelection.range), {inverse: CmdUtils.setSelection(viewWrapper.ref, oldSelection.idtype, oldSelection.range)});

      // check last view and if it will stay open for the new given selection
    } else {
      const i = this.state.views.indexOf(viewWrapper);
      const right = this.state.views[i + 1];

      // update selection with the last open (= right) view
      if (right === this.lastView && right.matchSelectionLength(newSelection.range.dim(0).length)) {
        right.setParameterSelection(newSelection);
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

  initNewSession(viewId: string, options: any, defaultSessionValues: any = null) {
    // store state to session before creating a new graph
    UserSession.getInstance().store(SESSION_KEY_NEW_ENTRY_POINT, {
      view: viewId,
      options,
      defaultSessionValues
    });

    // create new graph and apply new view after window.reload (@see targid.checkForNewEntryPoint())
    this.props.graphManager.newGraph();
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
          console.warn('remove view:', 'view not found in graph', (view ? `'${view.desc.id}'` : view));
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
  pushImpl(view: ViewWrapper) {
    view.on(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
    view.on(ViewWrapper.EVENT_CHOOSE_NEXT_VIEW, this.chooseNextView);
    view.on(AView.EVENT_ITEM_SELECT, this.updateSelection);
    // this.propagate(view, AView.EVENT_UPDATE_ENTRY_POINT);

    this.setState({
      views: [...this.state.views, view]
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
    view.off(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
    view.off(ViewWrapper.EVENT_CHOOSE_NEXT_VIEW, this.chooseNextView);
    view.off(AView.EVENT_ITEM_SELECT, this.updateSelection);

    this.setState({
      views: this.state.views.filter((v) => v !== view)
    });

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

  private replaceView(existingView: IObjectRef<ViewWrapper>, viewId: string, idtype: IDType, selection: Range, options?): Promise<ICmdResult> {
    return this.props.graph.push(CmdUtils.replaceView(this.ref, existingView, viewId, idtype, selection, options));
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
    // //notify views which next view is chosen
    // this.views.forEach((view, i) => {
    //   if (i < this.views.length - 1) {
    //     view.setActiveNextView(this.views[i + 1].desc.id);
    //   } else {
    //     view.setActiveNextView(null);
    //   }
    // });

    const historyClassNames = {
      [EViewMode.CONTEXT]: 't-context',
      [EViewMode.HIDDEN]: 't-hide',
      [EViewMode.FOCUS]: 't-focus'
    };

    return(
      <>
        <StartMenuComponent header={this.props.header} manager={this.props.graphManager} graph={this.props.graph} mode={this.state.mode}></StartMenuComponent>
        <ul className="tdp-button-group history">
          {this.state.views.map((view) => {
            return (
              <li key={view.desc.id} className={`hview ${historyClassNames[view.mode]}`}>
                <a href="#" onClick={(event) => {
                  event.preventDefault();
                  this.showInFocus(view);
                }}>{view.desc.name}</a>
              </li>
            );
          })}
        </ul>
        <OrdinoContext.Provider value={{app: this}}>
        <div className="wrapper">
          <div className="targid" ref={this.nodeRef}>{/* ViewWrapper will be rendered as child elements here */}</div>
        </div>
        </OrdinoContext.Provider>
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
