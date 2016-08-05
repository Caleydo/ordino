/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import C = require('../caleydo_core/main');
import prov = require('../caleydo_clue/prov');
import plugins = require('../caleydo_core/plugin');
import events = require('../caleydo_core/event');
import ranges = require('../caleydo_core/range');
import idtypes = require('../caleydo_core/idtype');
import session = require('TargidSession');
import d3 = require('d3');
import {
  ViewWrapper, EViewMode, createViewWrapper, AView, ISelection, setSelection, setAndUpdateSelection,
  replaceViewWrapper
} from './View';
import {ICmdResult, IAction} from '../caleydo_clue/prov';
import {CLUEGraphManager} from '../caleydo_clue/template';
import {StartMenu} from './StartMenu';
import {INamedSet} from './storage';


/**
 * Creates a view instance and wraps the instance with the inverse action in a CLUE command
 * @param inputs Array with object references, where the first one is the TargId object
 * @param parameter Parameter such idtype, selection and view options
 * @param graph The Provenance graph
 * @returns {Promise<ICmdResult>}
 */
export function createViewImpl(inputs:prov.IObjectRef<any>[], parameter:any, graph:prov.ProvenanceGraph):Promise<ICmdResult> {
  const targid:Targid = inputs[0].value;
  const viewId:string = parameter.viewId;
  const idtype = parameter.idtype ? idtypes.resolve(parameter.idtype) : null; // creates a new object
  const selection = parameter.selection ? ranges.parse(parameter.selection) : ranges.none(); // creates a new object
  const options = parameter.options;

  const view = plugins.get(TargidConstants.VIEW, viewId);

  var viewWrapperInstance; // store instance
  return createViewWrapper(graph, { idtype: idtype, range: selection }, targid.node, view, options)
    .then((instance) => {
      viewWrapperInstance = instance;
      return targid.pushImpl(instance);
    })
    .then((oldFocus) => {
      return (<ICmdResult>{
        created: [viewWrapperInstance.ref],
        inverse: (inputs, created, removed) => removeView(inputs[0], created[0], oldFocus)
      });
    });
}

/**
 * Removes a view instance and wraps the instance with the inverse action in a CLUE command
 * @param inputs Array with object references, where the first one is the TargId object
 * @param parameter Parameter such idtype, selection and view options
 * @returns {ICmdResult}
 */
export function removeViewImpl(inputs:prov.IObjectRef<any>[], parameter):ICmdResult {
  const targid:Targid = inputs[0].value;
  const view:ViewWrapper = inputs[1].value;
  const oldFocus:number = parameter.focus;

  targid.removeImpl(view, oldFocus);
  return (<ICmdResult>{
    removed: [inputs[1]],
    inverse: createView(inputs[0], view.desc.id, view.selection.idtype, view.selection.range, view.options)
  });
}

/**
 * Replaces a (inner) view of an existing ViewWrapper with a new (inner) view.
 * First backup the data of the existing view, delete it and then create a new view.
 * The inverse provenance graph action will restore the old view.
 *
 * @param inputs Array with object references, where the first one is the TargId object
 * @param parameter Parameter such idtype, selection and view options
 * @param graph The Provenance graph
 * @returns {Promise<ICmdResult>}
 */
export function replaceViewImpl(inputs:prov.IObjectRef<any>[], parameter:any):Promise<ICmdResult> {
  //const targid:Targid = inputs[0].value;
  const existingView:ViewWrapper = inputs[1].value;

  const oldParams = {
    viewId: existingView.desc.id,
    idtype: existingView.selection.idtype,
    selection: existingView.selection.range,
    options: existingView.options
  };

  const viewId:string = parameter.viewId;
  const idtype = parameter.idtype ? idtypes.resolve(parameter.idtype) : null; // creates a new object
  const selection = parameter.selection ? ranges.parse(parameter.selection) : ranges.none(); // creates a new object
  const options = parameter.options;

  // create new (inner) view
  const view = plugins.get(TargidConstants.VIEW, viewId);

  return replaceViewWrapper(existingView, { idtype: idtype, range: selection }, view, options)
    .then(() => {
      return (<ICmdResult>{
        created: [existingView.ref],
        inverse: (inputs, created, removed) => replaceView(inputs[0], created[0], oldParams.viewId, oldParams.idtype, oldParams.selection, oldParams.options)
      });
    });
}

/**
 * Creates a view and adds a CLUE command view to the provenance graph
 * @param targid
 * @param viewId
 * @param idtype
 * @param selection
 * @param options
 * @returns {IAction}
 */
export function createView(targid:prov.IObjectRef<Targid>, viewId:string, idtype:idtypes.IDType, selection:ranges.Range, options?):IAction {
  const view = plugins.get(TargidConstants.VIEW, viewId);
  // assert view
  return prov.action(prov.meta('Add ' + view.name, prov.cat.visual, prov.op.create), TargidConstants.CMD_CREATE_VIEW, createViewImpl, [targid], {
    viewId: viewId,
    idtype: idtype ? idtype.id : null,
    selection: selection ? selection.toString() : ranges.none().toString(),
    options: options
  });
}

/**
 * Removes a view and adds a CLUE command view to the provenance graph
 * @param targid
 * @param view ViewWrapper instance of the view
 * @param oldFocus
 * @returns {IAction}
 */
export function removeView(targid:prov.IObjectRef<Targid>, view:prov.IObjectRef<ViewWrapper>, oldFocus = -1):IAction {
  // assert view
  return prov.action(prov.meta('Remove ' + view.toString(), prov.cat.visual, prov.op.remove), TargidConstants.CMD_REMOVE_VIEW, removeViewImpl, [targid, view], {
    viewId: view.value.desc.id,
    focus: oldFocus
  });
}

/**
 * Replaces an (inner) view of an existing ViewWrapper and adds a CLUE command view to the provenance graph
 * @param targid
 * @param existingView
 * @param viewId
 * @param idtype
 * @param selection
 * @param options
 * @returns {IAction}
 */
export function replaceView(targid:prov.IObjectRef<Targid>, existingView:prov.IObjectRef<ViewWrapper>, viewId:string, idtype:idtypes.IDType, selection:ranges.Range, options?):IAction {
  const view = plugins.get(TargidConstants.VIEW, viewId);
  // assert view
  return prov.action(prov.meta('Replace ' + existingView.name + ' with ' + view.name, prov.cat.visual, prov.op.update), TargidConstants.CMD_REPLACE_VIEW, replaceViewImpl, [targid, existingView], {
    viewId: viewId,
    idtype: idtype ? idtype.id : null,
    selection: selection ? selection.toString() : ranges.none().toString(),
    options: options
  });
}


/**
 * Create a CLUE command by ID
 * @param id
 * @returns {ICmdFunction|null}
 */
export function createCmd(id):prov.ICmdFunction {
  switch (id) {
    case TargidConstants.CMD_CREATE_VIEW:
      return createViewImpl;
    case TargidConstants.CMD_REMOVE_VIEW:
      return removeViewImpl;
    case TargidConstants.CMD_REPLACE_VIEW:
      return replaceViewImpl;
  }
  return null;
}

/**
 * Factory function that compresses a series of action to fewer one.
 * Note: This function is referenced as `actionCompressor` in the package.json
 * @type {string}
 * @param path
 * @returns {Array}
 */
export function compressCreateRemove(path:prov.ActionNode[]) {
  var r = [];
  for (let i = 0; i < path.length; ++i) {
    let p = path[i];
    if (p.f_id === TargidConstants.CMD_REMOVE_VIEW && r.length > 0) {
      let last = r[r.length - 1];
      if (last.f_id === TargidConstants.CMD_CREATE_VIEW && p.parameter.viewId === last.parameter.viewId) {
        r.pop();
        continue;
      }
    }
    r.push(p);
  }
  return r;
}

export class TargidConstants {
  /**
   * Name of the application
   * Note: the string value is referenced in the package.json, i.e. be careful when refactor the value
   * @type {string}
   */
  static APP_NAME = 'Targid';

  /**
   * Static constant for creating a view command
   * Note: the string value is referenced for the `actionFactory` and `actionCompressor` in the package.json,
   *       i.e. be careful when refactor the value
   * @type {string}
   */
  static CMD_CREATE_VIEW = 'targidCreateView';

  /**
   * Static constant for removing a view command
   * Note: the string value is referenced for the `actionFactory` and `actionCompressor` in the package.json,
   *       i.e. be careful when refactor the value
   * @type {string}
   */
  static CMD_REMOVE_VIEW = 'targidRemoveView';

  /**
   * Static constant for replacing a view command
   * Note: the string value is referenced for the `actionFactory` and `actionCompressor` in the package.json,
   *       i.e. be careful when refactor the value
   * @type {string}
   */
  static CMD_REPLACE_VIEW = 'targidReplaceView';

  /**
   * Static constant as identification for Targid views
   * Note: the string value is referenced for multiple view definitions in the package.json,
   *       i.e. be careful when refactor the value
   */
  static VIEW = 'targidView';

  /**
   * Static constant for setting a parameter of a view
   * Note: the string value is referenced for the `actionFactory` in the package.json,
   *       i.e. be careful when refactor the value
   * @type {string}
   */
  static CMD_SET_PARAMETER = 'targidSetParameter';

  /**
   * Static constant for setting a selection of a view
   * Note: the string value is referenced for the `actionFactory` in the package.json,
   *       i.e. be careful when refactor the value
   * @type {string}
   */
  static CMD_SET_SELECTION = 'targidSetSelection';

  /**
   * Static constant to store details about a new entry point in the session
   * @type {string}
   */
  static NEW_ENTRY_POINT = 'targidNewEntryPoint';

}

/**
 * The main class for the TargID app
 * This class ...
 * - handles the creation, removal, and focus of views
 * - provides a reference to open views
 * - provides a reference to the provenance graph
 */
export class Targid {
  /**
   * List of open views (e.g., to show in the history)
   * @type {ViewWrapper[]}
   */
  private views:ViewWrapper[] = [];

  /**
   * IObjectRef to this Targid instance
   * @type {IObjectRef<Targid>}
   */
  ref:prov.IObjectRef<Targid>;

  private startMenu:Promise<StartMenu>;
  private $startMenu:d3.Selection<any>;
  private $history:d3.Selection<any>;
  private $node:d3.Selection<Targid>;

  private removeWrapper = (event:any, view:ViewWrapper) => this.remove(view);
  private openWrapper = (event:events.IEvent, viewId:string, idtype:idtypes.IDType, selection:ranges.Range) => this.openRight(<ViewWrapper>event.target, viewId, idtype, selection);
  private updateSelection = (event:events.IEvent, old: ISelection, new_: ISelection) => this.updateItemSelection(<ViewWrapper>event.target, old, new_);
  private updateStartMenu = (event:events.IEvent, idtype: idtypes.IDType | string, namedSet: INamedSet) => this.startMenu.then((menu) => menu.updateEntryPoint(idtype, namedSet));

  constructor(public graph:prov.ProvenanceGraph, public graphManager:CLUEGraphManager, parent:Element) {

    // add TargId app as (first) object to provenance graph
    this.ref = graph.findOrAddObject(this, TargidConstants.APP_NAME, prov.cat.visual);

    this.$startMenu = d3.select(parent).append('div').classed('startMenu', true);
    this.startMenu = plugins.get(TargidConstants.VIEW, 'startMenu').load().then((p) => {
      return p.factory(this.$startMenu.node(), { targid: this });
    });

    if(graph.isEmpty && session.has(TargidConstants.NEW_ENTRY_POINT) === false) {
      this.openStartMenu();
    }

    this.$history = d3.select(parent).append('ul').classed('history', true);
    this.$history.append('li').classed('homeButton', true)
      .html(`<a href="#">
        <i class="fa fa-home" aria-hidden="true"></i>
        <span class="sr-only">Start</span>
      </a>`);
    this.$history.select('.homeButton > a').on('click', (d) => {
      // prevent changing the hash (href)
      (<Event>d3.event).preventDefault();
      this.openStartMenu();
    });

    const $wrapper = d3.select(parent).append('div').classed('wrapper', true);

    this.$node = $wrapper.append('div').classed('targid', true).datum(this);
    plugins.get(TargidConstants.VIEW, 'welcome').load().then((p) => {
      p.factory(this.$node.node(), {});
    });

    this.checkForNewEntryPoint();
  }

  /**
   * Checks if a new entry point was selected (and stored in the session) and if so, creates a new view.
   */
  private checkForNewEntryPoint() {
    if(session.has(TargidConstants.NEW_ENTRY_POINT)) {
      const entryPoint:any = session.retrieve(TargidConstants.NEW_ENTRY_POINT);
      this.push(entryPoint.view, null, null, entryPoint.options);
      session.remove(TargidConstants.NEW_ENTRY_POINT);
    }
  }

  openStartMenu() {
    this.startMenu.then((startMenu) => {
      startMenu.open();
    });
  }

  get node() {
    return <Element>this.$node.node();
  }

  /**
   * Opens a new view using the viewId, idtype, selection and options.
   *
   * @param view The view that triggered the opener event.
   * @param viewId The new view that should be opened to the right.
   * @param idtype
   * @param selection
   * @param options
   */
  private openRight(view:ViewWrapper, viewId:string, idtype:idtypes.IDType, selection:ranges.Range, options?) {
    const mode = 2; // select opener mode
    switch (mode) {
      /**
       * Branch for every new detail view:
       * - Focus on view that triggered the open event --> jumps back in provenance graph
       * - Then branch the provenance graph with a new open view and set the old selection to the opener view
       */
      case 0:
        // first focus, then push the view
        this.focus(view).then(() => {
          this.pushView(viewId, idtype, selection, options);
          view.setItemSelection({idtype:idtype, range:selection});
        });

        break;

      /**
       * Linear history with remove and add action:
       * - Remove the old view --> new remove action in provenance graph
       * - Add the new view --> new add action in provenance graph
       * - Branches are only created for non-focus/context views (that triggered the open event)
       */
      case 1:
        // remove old views first, if the opener is not the last view
        if(view !== this.lastView) {
          this.remove(this.lastView);
        }
        // then push the new view
        this.pushView(viewId, idtype, selection, options);

        break;

      /**
       * Linear history with replace action (instead of dedicated remove/add action):
       * - Reuses the old viewWrapper, but creates a new child view inside
       * - Branches are only created for non-focus/context views (that triggered the open event)
       */
      case 2:
        // the opener is the last view, then nothing to replace --> just open the new view
        if(view === this.lastView) {
          this.pushView(viewId, idtype, selection, options);
          break;
        }

        // find the next view
        let index = this.views.lastIndexOf(view);
        if(index === -1) {
          console.error('Current view not found', view.desc.name);
          return;
        }
        const nextView = this.views[index+1];

        // trigger the replacement of the view
        this.replaceView(nextView.ref, viewId, idtype, selection, options);

        break;

      default:
        console.error('No mode for opening new views selected!');
    }
  }

  private updateItemSelection(view:ViewWrapper, old: ISelection, new_: ISelection, options?) {
    if (this.lastView === view) {
      //just update the selection
      this.graph.pushWithResult(setSelection(view.ref,new_.idtype, new_.range), { inverse : setSelection(view.ref, old.idtype, old.range)});
    } else {
      const i = this.views.indexOf(view);
      const right = this.views[i+1];
      if (right === this.lastView && right.matchSelectionLength(new_.range.dim(0).length)) {
        //update selection and within the view
        right.setParameterSelection(new_);
        this.graph.pushWithResult(setAndUpdateSelection(view.ref,right.ref, new_.idtype, new_.range), { inverse : setAndUpdateSelection(view.ref, right.ref, old.idtype, old.range)});
      } else {
        //jump to a previous state, record the selection and then patch the rest
        this.focus(view).then(() => {
          return this.graph.pushWithResult(setSelection(view.ref, new_.idtype, new_.range), {inverse: setSelection(view.ref, old.idtype, old.range)});
        }).then(() => {
          if (right.matchSelectionLength(new_.range.dim(0).length)) {
            return this.pushView(right.desc.id, new_.idtype, new_.range, options);
          }
        });
      }
    }
  }

  get lastView() {
    return this.views[this.views.length-1];
  }

  push(viewId:string, idtype:idtypes.IDType, selection:ranges.Range, options?) {
    // create the first view without changing the focus for the (non existing) previous view
    if(this.views.length === 0) {
      return this.pushView(viewId, idtype, selection, options);

    } else {
      return this.focus(this.views[0]).then(() => this.pushView(viewId, idtype, selection, options));
    }
  }

  private pushView(viewId:string, idtype:idtypes.IDType, selection:ranges.Range, options?) {
    return this.graph.push(createView(this.ref, viewId, idtype, selection, options));
  }

  remove(index_or_view:number|ViewWrapper) {
    const view = typeof index_or_view === 'number' ? this.views[<number>index_or_view] : <ViewWrapper>index_or_view;
    const view_ref = this.graph.findObject(view);
    if(view_ref === null) {
      console.warn('remove view:', 'view not found in graph', (view ? `'${view.desc.id}'` : view));
      return;
    }
    return this.graph.push(removeView(this.ref, view_ref));
  }

  pushImpl(view:ViewWrapper) {
    view.on(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
    view.on(ViewWrapper.EVENT_OPEN, this.openWrapper);
    view.on(AView.EVENT_ITEM_SELECT, this.updateSelection);
    view.on(AView.EVENT_UPDATE_ENTRY_POINT, this.updateStartMenu);
    this.views.push(view);
    this.update();
    return C.resolveIn(100).then(() => this.focusImpl(this.views.length - 1));
  }

  removeImpl(view:ViewWrapper, focus:number = -1) {
    const i = this.views.indexOf(view);
    view.off(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
    view.off(ViewWrapper.EVENT_OPEN, this.openWrapper);
    view.off(AView.EVENT_ITEM_SELECT, this.updateSelection);
    view.off(AView.EVENT_UPDATE_ENTRY_POINT, this.updateStartMenu);

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

  private replaceView(existingView:prov.IObjectRef<ViewWrapper>, viewId:string, idtype:idtypes.IDType, selection:ranges.Range, options?) {
    return this.graph.push(replaceView(this.ref, existingView, viewId, idtype, selection, options));
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
    var old = -1;
    this.views.forEach((v, i) => {
      if (v.mode === EViewMode.FOCUS) {
        old = i;
      }
      var target = EViewMode.HIDDEN;
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
    return C.resolveIn(1000).then(() => old);
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

/**
 * Helper function to filter views that were created
 * @param stateNode
 * @returns {boolean}
 */
function isCreateView(stateNode: prov.StateNode) {
  const creator = stateNode.creator;
  return creator != null && creator.meta.category === prov.cat.visual && creator.meta.operation === prov.op.create;
}

/**
 * Factory method to create a new Targid instance
 * @param graph
 * @param graphManager
 * @param parent
 * @returns {Targid}
 */
export function create(graph:prov.ProvenanceGraph, graphManager:CLUEGraphManager, parent:Element) {
  return new Targid(graph, graphManager, parent);
}
