/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import {resolveIn} from 'phovea_core/src/index';
import {IObjectRef, ProvenanceGraph, op, cat, StateNode} from 'phovea_core/src/provenance';
import IDType from 'phovea_core/src/idtype/IDType';
import {IEvent, EventHandler} from 'phovea_core/src/event';
import * as d3 from 'd3';
import * as welcomeArrow from 'url-loader!./images/welcome-view-arrow.svg';
import { ViewWrapper, EViewMode, AView, ISelection, setSelection, setAndUpdateSelection} from './View';
import TargidConstants from './constants';
export {default as TargidConstants} from './constants';
import {createView, removeView, replaceView} from './cmds';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import Range from 'phovea_core/src/range/Range';
/**
 * The main class for the TargID app
 * This class ...
 * - handles the creation, removal, and focus of views
 * - provides a reference to open views
 * - provides a reference to the provenance graph
 */
export class Targid extends EventHandler {
  /**
   * List of open views (e.g., to show in the history)
   * @type {ViewWrapper[]}
   */
  private readonly views:ViewWrapper[] = [];

  /**
   * IObjectRef to this Targid instance
   * @type {IObjectRef<Targid>}
   */
  readonly ref:IObjectRef<Targid>;

  private readonly $history:d3.Selection<any>;
  private readonly $node:d3.Selection<Targid>;

  private readonly removeWrapper = (event:any, view:ViewWrapper) => this.remove(view);
  private readonly chooseNextView = (event:IEvent, viewId:string, idtype:IDType, selection:Range) => this.handleNextView(<ViewWrapper>event.target, viewId, idtype, selection);
  private readonly updateSelection = (event:IEvent, old: ISelection, newValue: ISelection) => this.updateItemSelection(<ViewWrapper>event.target, old, newValue);

  constructor(public readonly graph:ProvenanceGraph, public readonly graphManager:CLUEGraphManager, parent:HTMLElement) {
    super();
    // add TargId app as (first) object to provenance graph
    this.ref = graph.findOrAddObject(this, TargidConstants.APP_NAME, cat.visual);


    this.$history = this.buildHistory(parent);

    const $wrapper = d3.select(parent).append('div').classed('wrapper', true);
    this.$node = $wrapper.append('div').classed('targid', true).datum(this);
    this.$node.html(`
    <div class="welcomeView">
      <img src="${welcomeArrow}">
      <h1>Start here</h1>
    </div>`);
  }

  private buildHistory(parent: HTMLElement) {
    const $history = d3.select(parent).append('ul').classed('history', true);
    $history.append('li').classed('homeButton', true)
      .html(`<a href="#">
        <i class="fa fa-home" aria-hidden="true"></i>
        <span class="sr-only">Start</span>
      </a>`);
    $history.select('.homeButton > a').on('click', (d) => {
      // prevent changing the hash (href)
      (<Event>d3.event).preventDefault();
      this.fire('openStartMenu');
    });
    return $history;
  }

  get node() {
    return <Element>this.$node.node();
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
  private handleNextView(viewWrapper:ViewWrapper, viewId:string, idtype:IDType, selection:Range, options?) {
    const index = this.views.indexOf(viewWrapper);
    const nextView = this.views[index+1];

    // close instead of "re-open" the same view again
    if(nextView !== undefined && nextView.desc.id === viewId) {
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
  private openOrReplaceNextView(viewWrapper:ViewWrapper, viewId:string, idtype:IDType, selection:Range, options?) {
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
        if(this.lastView === viewWrapper) {
          this.pushView(viewId, idtype, selection, options);
          break;
        }

        // find the next view
        const index = this.views.lastIndexOf(viewWrapper);
        if(index === -1) {
          console.error('Current view not found:', viewWrapper.desc.name, `(${viewWrapper.desc.id})`);
          return;
        }
        const nextView = this.views[index + 1];

        // if there are more views open, then close them first, before replacing the next view
        if(nextView !== this.lastView) {
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
  private updateItemSelection(viewWrapper:ViewWrapper, oldSelection: ISelection, newSelection: ISelection, options?) {
    // just update the selection for the last open view
    if (this.lastView === viewWrapper) {
      this.graph.pushWithResult(setSelection(viewWrapper.ref, newSelection.idtype, newSelection.range), { inverse : setSelection(viewWrapper.ref, oldSelection.idtype, oldSelection.range)});

    // check last view and if it will stay open for the new given selection
    } else {
      const i = this.views.indexOf(viewWrapper);
      const right = this.views[i+1];

      // update selection with the last open (= right) view
      if (right === this.lastView && right.matchSelectionLength(newSelection.range.dim(0).length)) {
        right.setParameterSelection(newSelection);
        this.graph.pushWithResult(setAndUpdateSelection(viewWrapper.ref, right.ref, newSelection.idtype, newSelection.range), { inverse : setAndUpdateSelection(viewWrapper.ref, right.ref, oldSelection.idtype, oldSelection.range)});

      // the selection does not match with the last open (= right) view --> close view
      } else {
        this.remove(right);
      }
    }
  }

  get lastView() {
    return this.views[this.views.length-1];
  }

  push(viewId:string, idtype:IDType, selection:Range, options?) {
    // create the first view without changing the focus for the (non existing) previous view
    if(this.views.length === 0) {
      return this.pushView(viewId, idtype, selection, options);

    } else {
      return this.focus(this.views[0]).then(() => this.pushView(viewId, idtype, selection, options));
    }
  }

  private pushView(viewId:string, idtype:IDType, selection:Range, options?) {
    return this.graph.push(createView(this.ref, viewId, idtype, selection, options));
  }

  /**
   * Removes a view, and if there are multiple open (following) views, close them in reverse order.
   * @param viewWrapper
   */
  remove(indexOrView:number|ViewWrapper) {
    const viewWrapper = typeof indexOrView === 'number' ? this.views[<number>indexOrView] : <ViewWrapper>indexOrView;
    const index = this.views.indexOf(viewWrapper);

    this.views
      .slice(index, this.views.length) // retrieve all following views
      .reverse() // remove them in reverse order
      .forEach((view) => {
        //this.remove(d);
        const viewRef = this.graph.findObject(view);
        if(viewRef === null) {
          console.warn('remove view:', 'view not found in graph', (view ? `'${view.desc.id}'` : view));
          return;
        }
        return this.graph.push(removeView(this.ref, viewRef));
      });

    // no views available, then open start menu
    if(index === 0) {
      this.fire('openStartMenu');
    }
  }

  pushImpl(view:ViewWrapper) {
    view.on(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
    view.on(ViewWrapper.EVENT_CHOOSE_NEXT_VIEW, this.chooseNextView);
    view.on(AView.EVENT_ITEM_SELECT, this.updateSelection);
    this.propagate(view, AView.EVENT_UPDATE_ENTRY_POINT);
    this.views.push(view);
    this.update();
    return resolveIn(100).then(() => this.focusImpl(this.views.length - 1));
  }

  removeImpl(view:ViewWrapper, focus:number = -1) {
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

  private replaceView(existingView:IObjectRef<ViewWrapper>, viewId:string, idtype:IDType, selection:Range, options?) {
    return this.graph.push(replaceView(this.ref, existingView, viewId, idtype, selection, options))
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
  focus(view: ViewWrapper) {
    const creators = this.graph.act.path.filter(isCreateView).map((d) => d.creator);
    const createdBy = this.graph.findOrAddJustObject(view.ref).createdBy;
    const i = creators.indexOf(createdBy);
    if ( i === (creators.length-1)) {
      //we are in focus - or should be
      return Promise.resolve(null);
    } else {
      //jump to the last state this view was in focus
      return this.graph.jumpTo(creators[i+1].previous);
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

  showInFocus(d: ViewWrapper) {
    this.focusImpl(this.views.indexOf(d));
  }

  focusImpl(index:number) {
    let old = -1;
    this.views.forEach((v, i) => {
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
    this.update();
    return resolveIn(1000).then(() => old);
  }

  private update() {
    const $views = this.$history.selectAll('li.hview').data(this.views);
    $views.enter()
      .append('li').classed('hview', true)
      .append('a').attr('href', '#')
      .on('click', (d) => {
        (<Event>d3.event).preventDefault();
        this.showInFocus(d);
      });

    $views
      .classed('t-context', (d) => d.mode === EViewMode.CONTEXT)
      .classed('t-hide', (d) => d.mode === EViewMode.HIDDEN)
      .classed('t-focus', (d) => d.mode === EViewMode.FOCUS)
      .select('a').text((d) => d.desc.name);
    $views.exit().remove();
  }
}
export default Targid;

/**
 * Helper function to filter views that were created
 * @param stateNode
 * @returns {boolean}
 */
function isCreateView(stateNode: StateNode) {
  const creator = stateNode.creator;
  return creator != null && creator.meta.category === cat.visual && creator.meta.operation === op.create;
}

/**
 * Factory method to create a new Targid instance
 * @param graph
 * @param graphManager
 * @param parent
 * @returns {Targid}
 */
export function create(graph:ProvenanceGraph, graphManager:CLUEGraphManager, parent:HTMLElement) {
  return new Targid(graph, graphManager, parent);
}
