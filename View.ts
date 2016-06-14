/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

/// <amd-dependency path="scrollTo" />

import prov = require('../caleydo_clue/prov');
import {EventHandler, IEventHandler} from '../caleydo_core/event';
import {IPluginDesc,IPlugin, list as listPlugins} from '../caleydo_core/plugin';
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');
import ajax = require('../caleydo_core/ajax');
import C = require('../caleydo_core/main');
import d3 = require('d3');



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

export interface IStartFactory {
  name: string;
  build(element : HTMLElement);
  options(): Promise<{ viewId: string; options: any }>;
}

class StartFactory implements IStartFactory {
  private builder: Promise<() => any> = null;

  constructor(private p : IPluginDesc) {

  }

  get name() {
    return this.p.name;
  }

  build(element: HTMLElement) {
    this.builder = this.p.load().then((i) => i.factory(element));
  }

  options() {
    return this.builder.then((i) => ({ viewId: (<any>this.p).viewId, options: i() }));
  }
}

/**
 * Creates the list of views that are used, but not of type "startView" (in package.json)
 * All views are categorized under "Extras"
 * @deprecated
 */
/*class MockStartFactory implements IStartFactory {
  private current: IViewPluginDesc = null;

  constructor(private views: IViewPluginDesc[]) {

  }

  get name() {
    return 'Extras';
  }

  build(element: HTMLElement) {
    this.current = this.views[0];
    const $options = d3.select(element).selectAll('div.radio').data(this.views);
    $options.enter().append('div').classed('radio', true)
      .html((d,i) => `<label><input type="radio" name="startView" value="${d.id}" ${i === 0 ? 'checked' : ''}>${d.name}</label>`)
      .select('input').on('change', (d) => this.current = d);
  }

  options() {
    return Promise.resolve({viewId: this.current.id, options: {}});
  }
}*/

function toStartFactory(p: IPluginDesc): IStartFactory {
  return new StartFactory(p);
}

export function findStartViewCreators(): IStartFactory[] {
  const plugins = listPlugins('targidStart');
  var factories = plugins.map(toStartFactory);

  // retrieve views that are used, but are not a start view and place them under "extras"
  /*const used = plugins.map((d) => (<any>d).viewId);
  const singleViews = findStartViews().filter((d) => used.indexOf(d.id) < 0);
  if (singleViews.length > 0) {
    factories.push(new MockStartFactory(singleViews));
  }*/

  return factories;
}

export function findViews(idtype:idtypes.IDType, selection:ranges.Range) : Promise<{enabled: boolean, v: IViewPluginDesc}[]> {
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
    return listPlugins('targidView').filter(byType).map((v) => ({enabled: bySelection(v), v: toViewPluginDesc(v)}));
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

  changeSelection(selection: ISelection);

  setItemSelection(selection: ISelection);

  getItemSelection(): ISelection;

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>);

  getParameter(name: string): any;

  setParameter(name: string, value: any);

  modeChanged(mode:EViewMode);

  destroy();
}

export class AView extends EventHandler implements IView {
  /**
   * event when one or more elements are selected for the next level
   * @type {string}
   * @argument selection {ISelection}
   */
  static EVENT_ITEM_SELECT = 'select';

  protected $node:d3.Selection<IView>;
  private itemSelection: ISelection = { idtype: null, range: ranges.none() };

  constructor(public context:IViewContext, parent:Element, options?) {
    super();
    this.$node = d3.select(parent).append('div').datum(this);
    this.$node.append('div').classed('busy', true);
  }

  protected setBusy(busy: boolean) {
    this.$node.select('div.busy').style('display',busy ? 'block': null);
  }

  changeSelection(selection: ISelection) {
    //hook
  }

  setItemSelection(selection: ISelection) {
    if (isSameSelection(this.itemSelection, selection)) {
      return;
    }
    //propagate
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
    //hook
  }

  getParameter(name: string): any {
    return null;
  }

  setParameter(name: string, value: any) {
    //hook
    return null;
  }

  modeChanged(mode:EViewMode) {
    //hook
  }

  protected resolveId(from_idtype: idtypes.IDType, id: number, to_idtype : idtypes.IDType|string = null): Promise<string> {
    const target = to_idtype === null ? from_idtype: idtypes.resolve(to_idtype);
    if (from_idtype.id === target.id) {
      //same just unmap to name
      return from_idtype.unmap([id]).then((names) => names[0]);
    }
    //assume mappable
    return from_idtype.mapToFirstName([id], target).then((names) => names[0]);
  }

  protected resolveIds(from_idtype: idtypes.IDType, ids: ranges.Range|number[], to_idtype : idtypes.IDType|string = null): Promise<string[]> {
    const target = to_idtype === null ? from_idtype: idtypes.resolve(to_idtype);
    if (from_idtype.id === target.id) {
      //same just unmap to name
      return from_idtype.unmap(ids);
    }
    //assume mappable
    return from_idtype.mapToFirstName(ids, target);
  }


  destroy() {
    this.$node.remove();
  }

  get node() {
    return <Element>this.$node.node();
  }
}



export class ProxyView extends AView {
  private options = {
    proxy: null,
    site: null,
    argument: 'gene',
    idtype: null,
    extra: {}
  };
  constructor(context:IViewContext, selection: ISelection, parent:Element, plugin: IPluginDesc, options?) {
    super(context, parent, options);
    C.mixin(this.options, plugin, options);

    this.$node.classed('proxy_view', true);

    this.build();
    this.changeSelection(selection);
  }

  private createUrl(args: any) {
    if (this.options.proxy) {
      return ajax.api2absURL('/targid/proxy/' + this.options.proxy, args);
    }
    if (this.options.site) {
      return this.options.site.replace(/\{([^}]+)\}/gi, (match, variable) => args[variable]);
    }
    return null;
  }

  changeSelection(selection: ISelection) {
    const id = selection.range.first;
    const idtype = selection.idtype;
    this.setBusy(true);
    this.resolveId(idtype, id, this.options.idtype).then((gene_name) => {
      if (gene_name != null) {
        var args = C.mixin(this.options.extra, {[this.options.argument]: gene_name});
        const url = this.createUrl(args);
        this.$node.select('iframe').attr('src', url);
      } else {
        this.$node.text('cant be mapped');
      }
      this.setBusy(false);
    });
  }

  private build() {
    this.$node.append('iframe').attr('src', null);
  }

  modeChanged(mode:EViewMode) {
    super.modeChanged(mode);
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
  return prov.action(prov.meta('Set Parameter "'+name+'"', prov.cat.visual, prov.op.update), 'targidSetParameter', setParameterImpl, [view], {
    name: name,
    value: value
  });
}

export function setSelectionImpl(inputs:prov.IObjectRef<any>[], parameter) {
  return inputs[0].v.then((view:ViewWrapper) => {
    const idtype = parameter.idtype ? idtypes.resolve(parameter.idtype) : null;
    const range = ranges.parse(parameter.range);

    const bak = view.getItemSelection();
    view.setItemSelection({ idtype: idtype, range: range});
    return {
      inverse: setSelection(inputs[0], bak.idtype, bak.range)
    };
  });
}
export function setSelection(view:prov.IObjectRef<ViewWrapper>, idtype: idtypes.IDType, range: ranges.Range) {
  //assert view
  return prov.action(prov.meta('Select '+(idtype ? idtype.name : 'None'), prov.cat.selection, prov.op.update), 'targidSetSelection', setSelectionImpl, [view], {
    idtype: idtype ? idtype.id: null,
    range: range.toString()
  });
}

export function createCmd(id):prov.ICmdFunction {
  switch (id) {
    case 'targidSetParameter':
      return setParameterImpl;
    case 'targidSetSelection':
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
  const possible = path.filter((p) => p.f_id === 'targidSetParameter');
  //group by view and parameter
  const toKey = (p: prov.ActionNode) => p.requires[0].id+'_'+p.parameter.name;
  const last = d3.nest().key(toKey).map(possible);
  return path.filter((p) => {
    if (p.f_id !== 'targidSetParameter') {
      return true;
    }
    const elems = last[toKey(p)];
    return elems[elems.length-1] === p; //just the last survives
  });
}

export function compressSetSelection(path:prov.ActionNode[]) {
  const lastByIDType : any = {};
  path.forEach((p) => {
    if (p.f_id === 'targidSetSelection') {
      const para = p.parameter;
      lastByIDType[para.idtype+'@'+p.requires[0].id] = p;
    }
  });
  return path.filter((p) => {
    if (p.f_id !== 'targidSetSelection') {
      return true;
    }
    const para = p.parameter;
    //last one remains
    return lastByIDType[para.idtype+'@'+p.requires[0].id] === p;
  });
}

export class ViewWrapper extends EventHandler {
  static EVENT_OPEN = 'open';
  static EVENT_FOCUS = 'focus';
  static EVENT_REMOVE = 'remove';

  private $viewWrapper:d3.Selection<ViewWrapper>;
  private $node:d3.Selection<ViewWrapper>;
  private $chooser:d3.Selection<ViewWrapper>;

  private mode_:EViewMode = null;

  private instance:IView = null;
  private sm_instances:IView[] = [];

  private listener = (event: any, old: ISelection, new_: ISelection) => {
    this.chooseNextViews(new_.idtype, new_.range);
    this.fire(AView.EVENT_ITEM_SELECT, old, new_);
  };

  ref: prov.IObjectRef<ViewWrapper>;

  context: IViewContext;

  constructor(graph: prov.ProvenanceGraph, public selection: ISelection, parent:Element, private plugin:IPlugin, public options?) {
    super();
    this.ref = prov.ref(this, 'View ' + plugin.desc.name, prov.cat.visual);
    this.context = createContext(graph, plugin.desc, this.ref);
    this.$viewWrapper = d3.select(parent).append('div').classed('viewWrapper', true);
    this.$node = this.$viewWrapper.append('div').classed('view', true).datum(this);
    this.$chooser = this.$viewWrapper.append('div').classed('chooser', true).datum(this).style('display', 'none');
    const $params = this.$node.append('div').attr('class', 'parameters form-inline');
    const $inner = this.$node.append('div').classed('inner', true);
    if(showAsSmallMultiple(this.desc)) {
      const ids = selection.range.dim(0).asList();
      $inner.classed('multiple', ids.length > 1);
      this.instance = plugin.factory(this.context, {idtype: selection.idtype, range: ranges.list(ids.shift())}, <Element>$inner.node(), options);
      ids.forEach((id) => {
        this.sm_instances.push(plugin.factory(this.context, {idtype: selection.idtype, range: ranges.list(id)}, <Element>$inner.node(), options));
      });
    } else {
      this.instance = plugin.factory(this.context, selection, <Element>$inner.node(), options);
    }
    this.instance.buildParameterUI($params, this.onParameterChange.bind(this));
    this.instance.on(AView.EVENT_ITEM_SELECT, this.listener);
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
    this.sm_instances.forEach((d) => d.setParameter(name, value));
    return this.instance.setParameter(name, value);
  }

  getItemSelection() {
    return this.instance.getItemSelection();
  }
  setItemSelection(sel: ISelection) {
    this.instance.off(AView.EVENT_ITEM_SELECT, this.listener);

    this.sm_instances.forEach((d) => d.setItemSelection(sel));

    this.instance.setItemSelection(sel);

    this.chooseNextViews(sel.idtype, sel.range);
    this.instance.on(AView.EVENT_ITEM_SELECT, this.listener);
  }

  setParameterSelection(selection: ISelection) {
    if (isSameSelection(this.selection, selection)) {
      return;
    }
    this.selection = selection;
    if(showAsSmallMultiple(this.desc)) {
      const ids = selection.range.dim(0).asList();
      this.$node.select('div.inner').classed('multiple', ids.length > 1);
      //first
      this.instance.changeSelection({idtype: selection.idtype, range: ranges.list(ids.shift())});
      //create a matching
      this.sm_instances.splice(ids.length).forEach((v) => {
        v.destroy();
      });
      this.sm_instances.forEach((v) => {
        v.changeSelection({idtype: selection.idtype, range: ranges.list(ids.shift())});
      });
      ids.forEach((id) => {
        this.sm_instances.push(this.plugin.factory(this.context, {idtype: selection.idtype, range: ranges.list(id)}, <Element>this.$node.select('div.inner').node(), this.options));
      });
    } else {
      this.instance.changeSelection(selection);
    }
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
    this.sm_instances.forEach((d) => d.modeChanged(mode));
    this.instance.modeChanged(mode);

    // on focus view scroll into view
    if(mode === EViewMode.FOCUS) {
      let $jqTargid = $(this.$viewWrapper.node()).parent();
      let viewWrapperNode = (<any>this.$viewWrapper.node());

      console.log($jqTargid, $jqTargid[0].scrollLeft, $jqTargid[0].getBoundingClientRect(), (<any>this.$viewWrapper.node()).offsetLeft);

      if($jqTargid[0].scrollLeft + $jqTargid[0].getBoundingClientRect().width <= viewWrapperNode.offsetLeft) {
        (<any>$jqTargid).scrollTo(viewWrapperNode.getBoundingClientRect().right, 500, {axis:'x'});

      } else {
        (<any>$jqTargid).scrollTo(viewWrapperNode.getBoundingClientRect().left, 500, {axis:'x'});
      }
    }
  }

  private chooseNextViews(idtype: idtypes.IDType, selection: ranges.Range) {
    this.$chooser.style('display', selection.isNone ? 'none' : null);

    const viewPromise = findViews(idtype, selection);
    viewPromise.then((views) => {
      //group views by category
      const data = d3.nest().key((d) => (<any>d).v.category || 'static').entries(views);
      const $categories = this.$chooser.selectAll('div.category').data(data);
      $categories.enter().append('div').classed('category', true);//.append('span');
      //$categories.select('span').text((d) => d.key);
      const $buttons = $categories.selectAll('button').data((d) => <{enabled: boolean, v: IViewPluginDesc}[]>d.values);
      $buttons.enter().append('button').classed('btn', true).classed('btn-default', true);
      $buttons.text((d) => d.v.name).on('click', (d) => {
        this.fire(ViewWrapper.EVENT_OPEN, d.v.id, idtype, selection);
      });
      $buttons.attr('disabled', (d) => d.v.mockup || !d.enabled ? 'disabled' : null);
      $buttons.exit().remove();

      $categories.exit().remove();
    });
  }

  get desc() {
    return toViewPluginDesc(this.plugin.desc);
  }

  get mode() {
    return this.mode_;
  }

  destroy() {
    this.instance.off(AView.EVENT_ITEM_SELECT, this.listener);
    this.instance.destroy();
    this.$viewWrapper.remove();
    this.$chooser.remove();
  }

  get node() {
    return <Element>this.$node.node();
  }

  remove() {
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

export function createWrapper(graph: prov.ProvenanceGraph, selection: ISelection, parent:Element, plugin:IPluginDesc, options?) {
  if ((<any>plugin).proxy || (<any>plugin).site) {
    //inline proxy
    return Promise.resolve(new ViewWrapper(graph, selection, parent, {
      desc: plugin,
      factory: (context, selection, node, options) => new ProxyView(context, selection, node, plugin, options)
    }, options));
  }
  return plugin.load().then((p) => new ViewWrapper(graph, selection, parent, p, options));
}

export interface IStartViewFactory {
  //constructor($parent: Element)
  create(): { viewId: string, options: any };
}
