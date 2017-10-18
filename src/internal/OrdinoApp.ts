/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import {resolveIn} from 'phovea_core/src/index';
import {IObjectRef, ProvenanceGraph, op, cat, StateNode} from 'phovea_core/src/provenance';
import IDType from 'phovea_core/src/idtype/IDType';
import {IEvent, EventHandler} from 'phovea_core/src/event';
import * as d3 from 'd3';
import {EViewMode, AView, ISelection} from 'tdp_core/src/views';
import ViewWrapper from './ViewWrapper';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {createView, removeView, replaceView, setSelection, setAndUpdateSelection} from './cmds';
import Range from 'phovea_core/src/range/Range';
import {SESSION_KEY_NEW_ENTRY_POINT} from './constants';
import * as session from 'phovea_core/src/session';
import {
  categoricalProperty, PropertyType,
  createPropertyValue, IProperty, IPropertyValue, TAG_VALUE_SEPARATOR, setProperty
} from 'phovea_core/src/provenance/retrieval/VisStateProperty';
import {IVisStateApp} from 'phovea_clue/src/provenance_retrieval/IVisState';
import {list as listPlugins} from 'phovea_core/src/plugin';
import {IFormSerializedElement} from 'tdp_core/src/form/interfaces';
import {EXTENSION_POINT_TDP_VIEW} from 'tdp_core/src/extensions';


/**
 * The main class for the Ordino app
 * This class ...
 * - handles the creation, removal, and focus of views
 * - provides a reference to open views
 * - provides a reference to the provenance graph
 */
export default class OrdinoApp extends EventHandler implements IVisStateApp {
  static readonly EVENT_OPEN_START_MENU = 'openStartMenu';
  /**
   * List of open views (e.g., to show in the history)
   * @type {ViewWrapper[]}
   */
  private readonly views:ViewWrapper[] = [];

  /**
   * IObjectRef to this OrdinoApp instance
   * @type {IObjectRef<OrdinoApp>}
   */
  readonly ref:IObjectRef<OrdinoApp>;

  private readonly $history:d3.Selection<any>;
  private readonly $node:d3.Selection<OrdinoApp>;

  private readonly removeWrapper = (event:any, view:ViewWrapper) => this.remove(view);
  private readonly chooseNextView = (event:IEvent, viewId:string, idtype:IDType, selection:Range) => this.handleNextView(<ViewWrapper>event.target, viewId, idtype, selection);
  private readonly updateSelection = (event:IEvent, old: ISelection, newValue: ISelection) => this.updateItemSelection(<ViewWrapper>event.target, old, newValue);

  constructor(public readonly graph:ProvenanceGraph, public readonly graphManager:CLUEGraphManager, parent:HTMLElement) {
    super();
    // add OrdinoApp app as (first) object to provenance graph
    // need old name for compatibility
    this.ref = graph.findOrAddObject(this, 'Targid', cat.visual);


    this.$history = this.buildHistory(parent);

    const $wrapper = d3.select(parent).append('div').classed('wrapper', true);
    this.$node = $wrapper.append('div').classed('targid', true).datum(this);
    this.$node.html(`
    <div class="welcomeView">
      <div></div>
      <h1>Start here</h1>
    </div>`);
  }

  private buildHistory(parent: HTMLElement) {
    const $history = d3.select(parent).append('ul').classed('tdp-button-group history', true);
    $history.append('li').classed('homeButton', true)
      .html(`<a href="#">
        <i class="fa fa-home" aria-hidden="true"></i>
        <span class="sr-only">Start</span>
      </a>`);
    $history.select('.homeButton > a').on('click', (d) => {
      // prevent changing the hash (href)
      (<Event>d3.event).preventDefault();
      this.fire(OrdinoApp.EVENT_OPEN_START_MENU);
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
    const selectionOptions = {
      mapRangeToNames: this.mapRangeToNames
    };
    // just update the selection for the last open view
    if (this.lastView === viewWrapper) {
      Promise.all([
        setSelection(viewWrapper.ref, newSelection.idtype, newSelection.range, oldSelection.range, selectionOptions),
        setSelection(viewWrapper.ref, oldSelection.idtype, oldSelection.range, newSelection.range, selectionOptions)
      ]).then((actions) => {
        this.graph.pushWithResult(actions[0], { inverse : actions[1]});
      });

    // check last view and if it will stay open for the new given selection
    } else {
      const i = this.views.indexOf(viewWrapper);
      const right = this.views[i+1];

      // update selection with the last open (= right) view
      if (right === this.lastView && right.matchSelectionLength(newSelection.range.dim(0).length)) {
        right.setParameterSelection(newSelection);
        Promise.all([
          setAndUpdateSelection(viewWrapper.ref, right.ref, newSelection.idtype, newSelection.range, oldSelection.range, selectionOptions),
          setAndUpdateSelection(viewWrapper.ref, right.ref, oldSelection.idtype, oldSelection.range, newSelection.range, selectionOptions)
        ]).then((actions) => {
          this.graph.pushWithResult(actions[0], { inverse : actions[1]});
        });

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

  initNewSession(view: string, options: any, defaultSessionValues: any = null) {
    // store state to session before creating a new graph
    session.store(SESSION_KEY_NEW_ENTRY_POINT, {
      view,
      options,
      defaultSessionValues
    });
    // create new graph and apply new view after window.reload (@see targid.checkForNewEntryPoint())
    this.graphManager.newGraph();
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

  /**
   * updates the views information, e.g. history
   */
  update() {
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

    //notify views which next view is chosen
    this.views.forEach((view, i) => {
      if (i < this.views.length - 1) {
        view.setActiveNextView(this.views[i + 1].desc.id);
      } else {
        view.setActiveNextView(null);
      }
    });
  }

  getVisStateProps(): Promise<IProperty[]> {
    const groupedViews = new Map<string, {id:string, text:string}[]>();
    listPlugins(EXTENSION_POINT_TDP_VIEW)
      .forEach((v) => {
        const group = (v.group) ? v.group.name : 'Other'; // fallback category if none is present
        let views = (groupedViews.has(group)) ? groupedViews.get(group) : [];
        views = [
          ...views,
          {id: String(v.id), text: v.name}
        ];
        groupedViews.set(group, views);
      });

    const viewsProp:IProperty[] = Array.from(groupedViews.entries())
      .sort((a, b) => a[0].toUpperCase().localeCompare(b[0].toUpperCase())) // ignore upper and lowercase
      .map((d) => categoricalProperty(`${d[0]} Views`, d[1]));

    const idtypesMap = new Map<string, Map<string, IPropertyValue>>();

    this.graph.states
      .map((s) => s.visState)
      .filter((vs) => vs.isPersisted())
      .map((vs) => vs.propValues)
      .reduce((prev, curr) => prev.concat(curr), []) // flatten the array
      .filter((d) => d && d.type === PropertyType.SET)
      .forEach((p) => {
        const propvals = idtypesMap.get(p.baseId) || new Map<string, IPropertyValue>();
        if(!propvals.has(p.id)) {
          propvals.set(p.id, p);
        }
        idtypesMap.set(p.baseId, propvals);
      });

    const selectionProps = Array.from(idtypesMap.keys())
      .map((key) => {
        return setProperty(`Selected ${key}`, Array.from(idtypesMap.get(key).values()));
      });

    return Promise.resolve([
      ...viewsProp,
      ...selectionProps
    ]);
  }

  getCurrVisState(): Promise<IPropertyValue[]> {
    const views:ViewWrapper[] = this.views.slice(-2); // get the focus and context view

    const viewPropVals = views.map((v) => {
      return createPropertyValue(PropertyType.CATEGORICAL, {
        id: String(v.desc.id),
        text: v.desc.name,
        group: 'views'
      });
    });

    const selectionPromises:Promise<IPropertyValue[]>[] = views
      .map((v) => {
        const idtype = v.getItemSelection().idtype;
        const range = v.getItemSelection().range;

        if(!idtype) {
          return Promise.resolve([]);
        }

        return Promise.all([this.mapRangeToNames(idtype, range), idtype.unmap(range)])
          .then((args) => {
            return args[0].map((name, i) => {
              return createPropertyValue(PropertyType.SET, {
                id: `${idtype.id} ${TAG_VALUE_SEPARATOR} ${args[1][i]}`,
                text: `${name}`,
                group: 'selections',
              });
            });
          });
      });

    const paramPropVals = views
      .map((v) => v.getAllParameters())
      .reduce((prev, curr) => prev.concat(curr), []) // flatten the array
      .map((param:IFormSerializedElement) => {
        return param.values.map((v) => {
          return createPropertyValue(PropertyType.SET, {
            id: `${param.id} ${TAG_VALUE_SEPARATOR} ${v.key}`,
            text: `${v.value}`,
            group: 'parameters',
            payload: {
              paramVal: v
            }
          });
        });
      })
      .reduce((prev, curr) => prev.concat(curr), []); // flatten the array;

    return Promise.all(selectionPromises)
      .then((selections:IPropertyValue[][]) => {
        const flatSelections = selections.reduce((prev, curr) => prev.concat(curr), []);
        return [...viewPropVals, ...flatSelections, ...paramPropVals];
      });
  }

  private mapRangeToNames(idtype:IDType, range:Range):Promise<string[]> {
    // Disabled the gene mapping for now, since the loadGeneList() is not available in this (ordino) repo
    //let mapper = idtype.unmap(range);
    //if(idtype.id === 'Ensembl') { // special case for genes
    //  mapper = mapper.then((names) => loadGeneList(names))
    //    .then((idAndSymbols) => idAndSymbols.map((d) => `${d.symbol} (${d.id})`));
    //}
    //return mapper;
    return idtype.unmap(range);
  };
}

/**
 * Helper function to filter views that were created
 * @param stateNode
 * @returns {boolean}
 */
function isCreateView(stateNode: StateNode) {
  const creator = stateNode.creator;
  return creator != null && creator.meta.category === cat.visual && creator.meta.operation === op.create;
}
