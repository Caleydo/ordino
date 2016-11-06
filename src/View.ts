/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import 'scrollTo';
import * as prov from 'phovea_core/src/provenance';
import * as idtypes from 'phovea_core/src/idtype';
import * as ranges from 'phovea_core/src/range';
import * as d3 from 'd3';
import * as $ from 'jquery';
import {TargidConstants} from './Targid';
import {EventHandler, IEventHandler} from 'phovea_core/src/event';
import {IPluginDesc, IPlugin, list as listPlugins} from 'phovea_core/src/plugin';
import {INamedSet} from './storage';


export enum EViewMode {
  FOCUS, CONTEXT, HIDDEN
}

export interface IViewPluginDesc extends IPluginDesc {
  selection: string; //none (0), single (1), multiple (>=1),
  idtype?: string;
  mockup?: boolean;
}

function toViewPluginDesc(p : IPluginDesc): IViewPluginDesc {
  var r : any = p;
  r.selection = r.selection || 'none';
  return r;
}

export function matchLength(s: any, length: number) {
  switch(String(s)) {
    case '':
    case 'none':
    case '0':
      return length === 0;
    case 'any':
      return true;
    case 'single':
    case '1':
    case 'small_multiple':
      return length === 1;
    case 'multiple':
    case 'some':
      return length >= 1;
    case '2':
      return length === 2;
    default:
      return false;
  }
}

function showAsSmallMultiple(desc: any) {
  return desc.selection === 'small_multiple';
}


/**
 * Find views for a given idtype and number of selected items.
 * The seleted items itself are not considered in this function.
 * @param idtype
 * @param selection
 * @returns {any}
 */
export function findViews(idtype:idtypes.IDType, selection:ranges.Range) : Promise<{enabled: boolean, v: IViewPluginDesc}[]> {
  if (idtype === null) {
    return Promise.resolve([]);
  }
  const selectionLength = idtype === null || selection.isNone ? 0 : selection.dim(0).length;
  return idtype.getCanBeMappedTo().then((mappedTypes) => {
    const all = [idtype].concat(mappedTypes);
    function byType(p: any) {
      const pattern = p.idtype ? new RegExp(p.idtype) : /.*/;
      return all.some((i) => pattern.test(i.id)) && !matchLength(p.selection, 0);
    }
    function bySelection(p: any) {
      return (matchLength(p.selection, selectionLength) || (showAsSmallMultiple(p) && selectionLength > 1));
    }
    return listPlugins(TargidConstants.VIEW).filter(byType).sort((a,b) => d3.ascending(a.name.toLowerCase(), b.name.toLowerCase())).map((v) => ({enabled: bySelection(v), v: toViewPluginDesc(v)}));
  });
}

export interface ISelection {
  idtype: idtypes.IDType;
  range: ranges.Range;
}

export interface IViewContext {
  graph: prov.ProvenanceGraph;
  desc: IViewPluginDesc;
  ref: prov.IObjectRef<any>;
}

export interface IView extends IEventHandler {
  //constructor(context: IViewContext, selection: ISelection, parent: Element, options?);

  node: Element;
  context:IViewContext;

  init();

  changeSelection(selection: ISelection);

  setItemSelection(selection: ISelection);

  getItemSelection(): ISelection;

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>);

  getParameter(name: string): any;

  setParameter(name: string, value: any);

  modeChanged(mode:EViewMode);

  destroy();
}

export abstract class AView extends EventHandler implements IView {
  /**
   * event when one or more elements are selected for the next level
   * @type {string}
   * @argument selection {ISelection}
   */
  static EVENT_ITEM_SELECT = 'select';

  static EVENT_UPDATE_ENTRY_POINT = 'update_entry_point';
  /**
   * event is fired when the loading of the iframe has finished
   * @type {string}
   * @argument selection {ISelection}
   */
  static EVENT_LOADING_FINISHED = 'loadingFinished';

  protected $node:d3.Selection<IView>;
  private itemSelection: ISelection = { idtype: null, range: ranges.none() };

  constructor(public context:IViewContext, parent:Element, options?) {
    super();
    this.$node = d3.select(parent).append('div').datum(this);
    this.$node.append('div').classed('busy', true).classed('hidden', true);
  }

  protected setBusy(busy: boolean) {
    this.$node.select('div.busy').classed('hidden', !busy);
  }

  init() {
    // hook
  }

  changeSelection(selection: ISelection) {
    // hook
  }

  setItemSelection(selection: ISelection) {
    if (isSameSelection(this.itemSelection, selection)) {
      return;
    }
    // propagate
    if (selection.idtype) {
      if (selection.range.isNone) {
        selection.idtype.clear(idtypes.defaultSelectionType);
      } else {
        selection.idtype.select(selection.range);
      }
    }
    this.fire(AView.EVENT_ITEM_SELECT, this.itemSelection, this.itemSelection = selection);
  }

  getItemSelection() {
    return this.itemSelection;
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    // hook
  }

  getParameter(name: string): any {
    return null;
  }

  setParameter(name: string, value: any) {
    // hook
    return null;
  }

  modeChanged(mode:EViewMode) {
    // hook
  }

  protected resolveIdToNames(from_idtype: idtypes.IDType, id: number, to_idtype : idtypes.IDType|string = null): Promise<string[][]> {
    const target = to_idtype === null ? from_idtype: idtypes.resolve(to_idtype);
    if (from_idtype.id === target.id) {
      // same just unmap to name
      return from_idtype.unmap([id]).then((names) => [names]);
    }

    // assume mappable
    return from_idtype.mapToName([id], target).then((names) => names);
  }

  protected resolveId(from_idtype: idtypes.IDType, id: number, to_idtype : idtypes.IDType|string = null): Promise<string> {
    const target = to_idtype === null ? from_idtype: idtypes.resolve(to_idtype);
    if (from_idtype.id === target.id) {
      // same just unmap to name
      return from_idtype.unmap([id]).then((names) => names[0]);
    }

    // assume mappable
    return from_idtype.mapToFirstName([id], target).then((names) => names[0]);
  }

  protected resolveIds(from_idtype: idtypes.IDType, ids: ranges.Range|number[], to_idtype : idtypes.IDType|string = null): Promise<string[]> {
    const target = to_idtype === null ? from_idtype: idtypes.resolve(to_idtype);
    if (from_idtype.id === target.id) {
      // same just unmap to name
      return from_idtype.unmap(ids);
    }
    // assume mappable
    return from_idtype.mapToFirstName(ids, target);
  }

  destroy() {
    this.$node.remove();
  }

  get node() {
    return <Element>this.$node.node();
  }
}

export abstract class ASmallMultipleView extends AView {

  protected margin = {top: 40, right: 5, bottom: 50, left: 50};
  protected width = 280 - this.margin.left - this.margin.right;
  protected height = 320 - this.margin.top - this.margin.bottom;

  constructor(context:IViewContext, selection: ISelection, parent:Element, plugin: IPluginDesc, options?) {
    super(context, parent, options);
  }

  init() {
    super.init();
    this.$node.classed('multiple', true);
  }
}


export function setParameterImpl(inputs:prov.IObjectRef<any>[], parameter, graph:prov.ProvenanceGraph) {
  return inputs[0].v.then((view:ViewWrapper) => {
    const name = parameter.name;
    const value = parameter.value;

    const bak = view.getParameter(name);
    view.setParameterImpl(name, value);
    return {
      inverse: setParameter(inputs[0], name, bak)
    };
  });
}
export function setParameter(view:prov.IObjectRef<ViewWrapper>, name: string, value: any) {
  //assert view
  return prov.action(prov.meta('Set Parameter "'+name+'"', prov.cat.visual, prov.op.update), TargidConstants.CMD_SET_PARAMETER, setParameterImpl, [view], {
    name: name,
    value: value
  });
}

export function setSelectionImpl(inputs:prov.IObjectRef<any>[], parameter) {
  return Promise.all([inputs[0].v, inputs.length > 1 ? inputs[1].v : null]).then((views:ViewWrapper[]) => {
    const view = views[0];
    const target = views[1];
    const idtype = parameter.idtype ? idtypes.resolve(parameter.idtype) : null;
    const range = ranges.parse(parameter.range);

    const bak = view.getItemSelection();
    view.setItemSelection({ idtype: idtype, range: range});
    if (target) {
      target.setParameterSelection({ idtype: idtype, range: range});
    }
    return {
      inverse: inputs.length > 1 ? setAndUpdateSelection(inputs[0], inputs[1], bak.idtype, bak.range): setSelection(inputs[0], bak.idtype, bak.range)
    };
  });
}
export function setSelection(view:prov.IObjectRef<ViewWrapper>, idtype: idtypes.IDType, range: ranges.Range) {
  // assert view
  return prov.action(prov.meta('Select '+(idtype ? idtype.name : 'None'), prov.cat.selection, prov.op.update), TargidConstants.CMD_SET_SELECTION, setSelectionImpl, [view], {
    idtype: idtype ? idtype.id : null,
    range: range.toString()
  });
}

export function setAndUpdateSelection(view:prov.IObjectRef<ViewWrapper>, target:prov.IObjectRef<ViewWrapper>, idtype: idtypes.IDType, range: ranges.Range) {
  // assert view
  return prov.action(prov.meta('Select '+(idtype ? idtype.name : 'None'), prov.cat.selection, prov.op.update), TargidConstants.CMD_SET_SELECTION, setSelectionImpl, [view, target], {
    idtype: idtype ? idtype.id : null,
    range: range.toString()
  });
}

export function createCmd(id):prov.ICmdFunction {
  switch (id) {
    case TargidConstants.CMD_SET_PARAMETER:
      return setParameterImpl;
    case TargidConstants.CMD_SET_SELECTION:
      return setSelectionImpl;
  }
  return null;
}

function isSameSelection(a: ISelection, b: ISelection) {
  const aNull = (a === null || a.idtype === null);
  const bNull = (b === null || b.idtype === null);
  if (aNull || bNull) {
    return aNull === bNull;
  }
  return a.idtype.id === b.idtype.id && a.range.eq(b.range);
}

/**
 * compresses the given path by removing redundant focus operations
 * @param path
 * @returns {prov.ActionNode[]}
 */
export function compressSetParameter(path:prov.ActionNode[]) {
  const possible = path.filter((p) => p.f_id === TargidConstants.CMD_SET_PARAMETER);
  //group by view and parameter
  const toKey = (p: prov.ActionNode) => p.requires[0].id+'_'+p.parameter.name;
  const last = d3.nest().key(toKey).map(possible);
  return path.filter((p) => {
    if (p.f_id !== TargidConstants.CMD_SET_PARAMETER) {
      return true;
    }
    const elems = last[toKey(p)];
    return elems[elems.length-1] === p; //just the last survives
  });
}

export function compressSetSelection(path:prov.ActionNode[]) {
  const lastByIDType : any = {};
  path.forEach((p) => {
    if (p.f_id === TargidConstants.CMD_SET_SELECTION) {
      const para = p.parameter;
      lastByIDType[para.idtype+'@'+p.requires[0].id] = p;
    }
  });
  return path.filter((p) => {
    if (p.f_id !== TargidConstants.CMD_SET_SELECTION) {
      return true;
    }
    const para = p.parameter;
    //last one remains
    return lastByIDType[para.idtype+'@'+p.requires[0].id] === p;
  });
}

function generate_hash(desc: IPluginDesc, selection: ISelection, options : any = {}) {
  var s = (selection.idtype ? selection.idtype.id : '')+'r' + (selection.range.toString());
  return desc.id+'_'+s;
}

export class ViewWrapper extends EventHandler {
  static EVENT_CHOOSE_NEXT_VIEW = 'open';
  static EVENT_FOCUS = 'focus';
  static EVENT_REMOVE = 'remove';

  private $viewWrapper:d3.Selection<ViewWrapper>;
  private $node:d3.Selection<ViewWrapper>;
  private $chooser:d3.Selection<ViewWrapper>;

  private mode_:EViewMode = null;

  private instance:IView = null;

  /**
   * Listens to the AView.EVENT_ITEM_SELECT event and decided if the chooser should be visible.
   * Then dispatches the incoming event again (aka bubbles up).
   * @param event
   * @param old
   * @param new_
   */
  private listenerItemSelect = (event: any, old: ISelection, new_: ISelection) => {
    this.chooseNextViews(new_.idtype, new_.range);
    this.fire(AView.EVENT_ITEM_SELECT, old, new_);
  };

  /**
   * Forward event from view to Targid instance
   * @param event
   * @param idtype
   * @param namedSet
   */
  private listenerUpdateEntryPoint = (event: any, idtype: idtypes.IDType | string, namedSet: INamedSet) => {
    this.fire(AView.EVENT_UPDATE_ENTRY_POINT, idtype, namedSet);
  };

  /**
   * Wrapper function for event listener
   * @param event
   */
  private scrollIntoViewListener = (event:any) => {
    this.scrollIntoView();
  };

  /**
   * Provenance graph reference of this object
   */
  ref: prov.IObjectRef<ViewWrapper>;

  /**
   * Provenance graph context
   */
  context: IViewContext;

  /**
   * Initialize this view, create the root node and the (inner) view
   * @param graph
   * @param selection
   * @param parent
   * @param plugin
   * @param options
   */
  constructor(private graph: prov.ProvenanceGraph, public selection: ISelection, parent:Element, private plugin:IPlugin, public options?) {
    super();

    this.init(graph, selection, plugin, options);

    // create ViewWrapper root node
    this.$viewWrapper = d3.select(parent).append('div').classed('viewWrapper', true);

    this.createView(selection, plugin, options);
  }

  /**
   * Create provenance reference object (`this.ref`) and the context (`this.context`)
   * @param graph
   * @param selection
   * @param plugin
   * @param options
   */
  private init(graph: prov.ProvenanceGraph, selection: ISelection, plugin:IPlugin, options?) {
    // create provenance reference
    this.ref = prov.ref(this, plugin.desc.name, prov.cat.visual, generate_hash(plugin.desc, selection, options));

    //console.log(graph, generate_hash(plugin.desc, selection, options));

    // create (inner) view context
    this.context = createContext(graph, plugin.desc, this.ref);
  }

  /**
   * Create the corresponding DOM elements + chooser and the new (inner) view from the given parameters
   * @param selection
   * @param plugin
   * @param options
   */
  private createView(selection: ISelection, plugin:IPlugin, options?) {
    this.$node = this.$viewWrapper.append('div')
      .classed('view', true)
      .datum(this);

    this.$chooser = this.$viewWrapper.append('div')
      .classed('chooser', true)
      .classed('hidden', true) // closed by default --> opened on selection (@see this.chooseNextViews())
      .datum(this);

    const $params = this.$node.append('div')
      .attr('class', 'parameters form-inline')
      .datum(this);

    $params.append('button')
      .attr('class', 'btn btn-default btn-sm btn-close')
      .html('<i class="fa fa-close"></i>')
      .on('click', (d) => {
        this.remove();
      });

    const $inner = this.$node.append('div')
      .classed('inner', true);

    this.instance = plugin.factory(this.context, selection, <Element>$inner.node(), options, plugin.desc);
    this.instance.buildParameterUI($params, this.onParameterChange.bind(this));
    this.instance.init();

    this.instance.on(AView.EVENT_ITEM_SELECT, this.listenerItemSelect);
    this.instance.on(AView.EVENT_UPDATE_ENTRY_POINT, this.listenerUpdateEntryPoint);

    this.instance.on(AView.EVENT_LOADING_FINISHED, this.scrollIntoViewListener);
  }

  /**
   * Replace the inner view with a new view, created from the given parameters.
   * Note: Destroys all references and DOM elements of the old view, except the root node of this ViewWrapper
   * @param selection
   * @param plugin
   * @param options
   */
  public replaceView(selection: ISelection, plugin:IPlugin, options?) {
    this.destroyView();

    this.selection = selection;
    this.plugin = plugin;
    this.options = options;

    this.init(this.graph, selection, plugin, options);
    this.createView(selection, plugin, options);
  }

  /**
   * De-attache the event listener to (inner) view, destroys instance and removes the DOM elements
   */
  private destroyView() {
    // un/register listener only for ProxyViews
    this.instance.off(AView.EVENT_LOADING_FINISHED, this.scrollIntoViewListener);
    this.instance.off(AView.EVENT_ITEM_SELECT, this.listenerItemSelect);
    this.instance.off(AView.EVENT_UPDATE_ENTRY_POINT, this.listenerUpdateEntryPoint);
    this.instance.destroy();

    this.$viewWrapper.select('.view').remove();
    this.$chooser.remove();
  }

  /**
   * Destroys the inner view and the ViewWrapper's root node
   */
  destroy() {
    this.destroyView();
    this.$viewWrapper.remove();
  }

  getInstance() {
    return this.instance;
  }


  private onParameterChange(name: string, value: any) {
    return this.context.graph.push(setParameter(this.ref, name, value));
  }

  getParameter(name: string) {
    return this.instance.getParameter(name);
  }

  setParameterImpl(name: string, value: any) {
    return this.instance.setParameter(name, value);
  }

  getItemSelection() {
    return this.instance.getItemSelection();
  }

  setItemSelection(sel: ISelection) {
    // turn listener off, to prevent an infinite event loop
    this.instance.off(AView.EVENT_ITEM_SELECT, this.listenerItemSelect);

    this.instance.setItemSelection(sel);

    this.chooseNextViews(sel.idtype, sel.range);

    // turn listener on again
    this.instance.on(AView.EVENT_ITEM_SELECT, this.listenerItemSelect);
  }

  setParameterSelection(selection: ISelection) {
    if (isSameSelection(this.selection, selection)) {
      return;
    }

    this.instance.changeSelection(selection);
  }

  getParameterSelection() {
    return this.selection;
  }

  matchSelectionLength(length: number) {
    return matchLength(this.desc.selection, length) ||(showAsSmallMultiple(this.desc) && length > 1);
  }

  set mode(mode:EViewMode) {
    if (this.mode_ === mode) {
      return;
    }
    const b = this.mode_;
    this.modeChanged(mode);
    this.fire('modeChanged', this.mode_ = mode, b);
  }

  protected modeChanged(mode:EViewMode) {
    // update css classes
    this.$viewWrapper
      .classed('t-hide', mode === EViewMode.HIDDEN)
      .classed('t-focus', mode === EViewMode.FOCUS)
      .classed('t-context', mode === EViewMode.CONTEXT)
      .classed('t-active', mode === EViewMode.CONTEXT || mode === EViewMode.FOCUS);
    this.$chooser
      .classed('t-hide', mode === EViewMode.HIDDEN);

    // trigger modeChanged
    this.instance.modeChanged(mode);

    // on focus view scroll into view
    if(mode === EViewMode.FOCUS) {
      this.scrollIntoView();
    }
  }

  private scrollIntoView() {
    let prev = (<any>this.$viewWrapper.node()).previousSibling;
    let scrollToPos = prev ? prev.offsetLeft || 0 : 0;
    let $jqTargid = $(this.$viewWrapper.node()).parent();
    (<any>$jqTargid).scrollTo(scrollToPos, 500, {axis:'x'});
  }

  /**
   * Decide if a chooser for the next view should be shown and if so, which next views are available
   * @param idtype
   * @param range
   */
  private chooseNextViews(idtype: idtypes.IDType, range: ranges.Range) {
    const that = this;

    // show chooser if selection available
    this.$chooser.classed('hidden', range.isNone);

    if(range.isNone) {
      this.$chooser.selectAll('button').classed('active', false);
    }

    findViews(idtype, range).then((views) => {
      const data = [];
      data[0] = views.filter((d:any) => d.v.category === undefined || d.v.category !== 'static');
      data[1] = views.filter((d:any) => d.v.category !== undefined && d.v.category === 'static');

      const $categories = this.$chooser.selectAll('div.category').data(data);

      $categories.enter().append('div').classed('category', true);
      $categories.exit().remove();

      const $buttons = $categories.selectAll('button').data((d:{enabled: boolean, v: IViewPluginDesc}[]) => d);

      $buttons.enter().append('button')
        .classed('btn', true)
        .classed('btn-default', true);

      $buttons.text((d) => d.v.name)
        .attr('disabled', (d) => d.v.mockup || !d.enabled ? 'disabled' : null)
        .on('click', function(d) {
          $buttons.classed('active', false);
          d3.select(this).classed('active', true);

          that.fire(ViewWrapper.EVENT_CHOOSE_NEXT_VIEW, d.v.id, idtype, range);
        });

      $buttons.exit().remove();
    });
  }

  get desc() {
    return toViewPluginDesc(this.plugin.desc);
  }

  get mode() {
    return this.mode_;
  }

  get node() {
    return <Element>this.$node.node();
  }

  remove() {
    console.log('EVENT_REMOVE');
    this.fire(ViewWrapper.EVENT_REMOVE, this);
  }

  focus() {
    this.fire(ViewWrapper.EVENT_FOCUS, this);
  }
}

export function createContext(graph:prov.ProvenanceGraph, desc: IPluginDesc, ref: prov.IObjectRef<any>):IViewContext {
  return {
    graph: graph,
    desc: toViewPluginDesc(desc),
    ref: ref
  };
}

export function createViewWrapper(graph: prov.ProvenanceGraph, selection: ISelection, parent:Element, plugin:IPluginDesc, options?) {
  return plugin.load().then((p) => new ViewWrapper(graph, selection, parent, p, options));
}

export function replaceViewWrapper(existingView:ViewWrapper, selection: ISelection, plugin:IPluginDesc, options?) {
  return plugin.load().then((p) => existingView.replaceView(selection, p, options));
}
