/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import 'scrollTo';
import {ProvenanceGraph, IObjectRef, ref, cat} from 'phovea_core/src/provenance';
import {IDType, resolve, defaultSelectionType} from 'phovea_core/src/idtype';
import {Range, none, parse} from 'phovea_core/src/range';
import * as d3 from 'd3';
import * as $ from 'jquery';
import TargidConstants from './constants';
import {EventHandler, IEventHandler} from 'phovea_core/src/event';
import {IPluginDesc, IPlugin, list as listPlugins} from 'phovea_core/src/plugin';
import {INamedSet} from './storage';
import {setParameter} from './cmds';
import {IFormSerializedElement} from './form/interfaces';


export enum EViewMode {
  FOCUS, CONTEXT, HIDDEN
}

export interface IViewPluginDesc extends IPluginDesc {
  selection: string; //none (0), single (1), multiple (>=1),
  idtype?: string;
  mockup?: boolean;
}

export function toViewPluginDesc(p : IPluginDesc): IViewPluginDesc {
  const r : any = p;
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
    case 'chooser':
    case 'some':
      return length >= 1;
    case '2':
      return length === 2;
    default:
      return false;
  }
}

/**
 * whether the view should be used as small multiple in case of multiple selections
 * @param desc
 * @returns {boolean}
 */
export function showAsSmallMultiple(desc: any) {
  return desc.selection === 'small_multiple';
}

/**
 * whether the view is going to use a chooser for multiple selections
 * @param desc
 * @returns {boolean}
 */
export function willShowChooser(desc: any) {
  return desc.selection === 'chooser';
}

/**
 * Find views for a given idtype and number of selected items.
 * The selected items itself are not considered in this function.
 * @param idtype
 * @param selection
 * @returns {any}
 */
export async function findViews(idtype:IDType, selection:Range) : Promise<{enabled: boolean, v: IViewPluginDesc}[]> {
  if (idtype === null) {
    return Promise.resolve([]);
  }
  const selectionLength = idtype === null || selection.isNone ? 0 : selection.dim(0).length;
  const mappedTypes = await idtype.getCanBeMappedTo();
  const all = [idtype].concat(mappedTypes);
  function byType(p: any) {
    const pattern = p.idtype ? new RegExp(p.idtype) : /.*/;
    return all.some((i) => pattern.test(i.id)) && !matchLength(p.selection, 0);
  }
  //disable certain views based on another plugin
  const disabler = listPlugins(TargidConstants.EXTENSION_POINT_DISABLE_VIEW).map((p: any) => new RegExp(p.filter));
  function disabled(p: IPluginDesc) {
    return disabler.some((re) => re.test(p.id));
  }
  function bySelection(p: any) {
    return (matchLength(p.selection, selectionLength) || (showAsSmallMultiple(p) && selectionLength > 1));
  }

  // execute extension filters
  const filters = await Promise.all(listPlugins(TargidConstants.FILTERS_EXTENSION_POINT_ID).map((plugin) => plugin.load()));
  function extensionFilters(p: IPluginDesc) {
    const f = p.filter || {};
    return filters.every((filter) => filter.factory(f));
  }

  return listPlugins(TargidConstants.VIEW)
    .filter((p) => byType(p) && !disabled(p) && extensionFilters(p))
    .sort((a,b) => d3.ascending(a.name.toLowerCase(), b.name.toLowerCase()))
    .map((v) => ({enabled: bySelection(v), v: toViewPluginDesc(v)}));
}

export interface ISelection {
  idtype: IDType;
  range: Range;
}

export interface IViewContext {
  readonly graph: ProvenanceGraph;
  readonly desc: IViewPluginDesc;
  readonly ref: IObjectRef<any>;
}

export interface IView extends IEventHandler {
  //constructor(context: IViewContext, selection: ISelection, parent: Element, options?);

  node: Element;
  context:IViewContext;

  init(): void;

  changeSelection(selection: ISelection): void;

  setItemSelection(selection: ISelection): void;

  getItemSelection(): ISelection;

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>): void;

  getParameter(name: string): any;

  setParameter(name: string, value: any);

  getAllParameters(): IFormSerializedElement[];

  modeChanged(mode:EViewMode);

  destroy(): void;
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
  private itemSelection: ISelection = { idtype: null, range: none() };

  protected readonly idType: IDType;

  constructor(public readonly context:IViewContext, parent:Element, options?: {}) {
    super();
    this.$node = d3.select(parent).append('div').datum(this);
    this.$node.append('div').classed('busy', true).classed('hidden', true);
    this.idType = resolve(context.desc.idtype);
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
        selection.idtype.clear(defaultSelectionType);
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

  getAllParameters():IFormSerializedElement[] {
    // hook
    return [];
  }

  modeChanged(mode:EViewMode) {
    // hook
  }

  protected resolveIdToNames(fromIDType: IDType, id: number, toIDType : IDType|string = null): Promise<string[][]> {
    const target = toIDType === null ? fromIDType: resolve(toIDType);
    if (fromIDType.id === target.id) {
      // same just unmap to name
      return fromIDType.unmap([id]).then((names) => [names]);
    }

    // assume mappable
    return fromIDType.mapToName([id], target).then((names) => names);
  }

  protected resolveId(fromIDType: IDType, id: number, toIDtype : IDType|string = null): Promise<string> {
    const target = toIDtype === null ? fromIDType: resolve(toIDtype);
    if (fromIDType.id === target.id) {
      // same just unmap to name
      return fromIDType.unmap([id]).then((names) => names[0]);
    }

    // assume mappable
    return fromIDType.mapToFirstName([id], target).then((names) => names[0]);
  }

  protected resolveIds(fromIDType: IDType, ids: Range|number[], toIDType : IDType|string = null): Promise<string[]> {
    const target = toIDType === null ? fromIDType: resolve(toIDType);
    if (fromIDType.id === target.id) {
      // same just unmap to name
      return fromIDType.unmap(ids);
    }
    // assume mappable
    return fromIDType.mapToFirstName(ids, target);
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

  constructor(context:IViewContext, selection: ISelection, parent:Element, plugin: IPluginDesc, options?: {}) {
    super(context, parent, options);
  }

  init() {
    super.init();
    this.$node.classed('multiple', true);
  }
}

export function isSameSelection(a: ISelection, b: ISelection) {
  const aNull = (a === null || a.idtype === null);
  const bNull = (b === null || b.idtype === null);
  if (aNull || bNull) {
    return aNull === bNull;
  }
  return a.idtype.id === b.idtype.id && a.range.eq(b.range);
}

function generate_hash(desc: IPluginDesc, selection: ISelection) {
  const s = (selection.idtype ? selection.idtype.id : '')+'r' + (selection.range.toString());
  return desc.id+'_'+s;
}

export class ViewWrapper extends EventHandler {
  static EVENT_CHOOSE_NEXT_VIEW = 'open';
  static EVENT_FOCUS = 'focus';
  static EVENT_REMOVE = 'remove';

  private $viewWrapper:d3.Selection<ViewWrapper>;
  private $node:d3.Selection<ViewWrapper>;
  private $chooser:d3.Selection<ViewWrapper>;

  private _mode:EViewMode = null;

  private instance:IView = null;

  /**
   * Listens to the AView.EVENT_ITEM_SELECT event and decided if the chooser should be visible.
   * Then dispatches the incoming event again (aka bubbles up).
   * @param event
   * @param oldSelection
   * @param newSelection
   */
  private listenerItemSelect = (event: any, oldSelection: ISelection, newSelection: ISelection) => {
    this.chooseNextViews(newSelection.idtype, newSelection.range);
    this.fire(AView.EVENT_ITEM_SELECT, oldSelection, newSelection);
  }

  /**
   * Forward event from view to Targid instance
   * @param event
   * @param idtype
   * @param namedSet
   */
  private listenerUpdateEntryPoint = (event: any, idtype: IDType | string, namedSet: INamedSet) => {
    this.fire(AView.EVENT_UPDATE_ENTRY_POINT, idtype, namedSet);
  }

  /**
   * Wrapper function for event listener
   */
  private scrollIntoViewListener = () => {
    this.scrollIntoView();
  }

  /**
   * Provenance graph reference of this object
   */
  readonly ref: IObjectRef<ViewWrapper>;

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
  constructor(private readonly graph: ProvenanceGraph, public selection: ISelection, parent:Element, private plugin:IPlugin, public options?) {
    super();

    // create provenance reference
    this.ref = ref(this, plugin.desc.name, cat.visual, generate_hash(plugin.desc, selection));

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
  private init(graph: ProvenanceGraph, selection: ISelection, plugin:IPlugin, options?) {

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

    this.$node.append('button')
      .attr('type', 'button')
      .attr('class', 'close')
      .attr('aria-label','Close')
      .html(`<span aria-hidden="true">×</span>`)
      .on('click', (d) => {
        this.remove();
      });

    const $params = this.$node.append('div')
      .attr('class', 'parameters form-inline')
      .datum(this);

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

  getAllParameters():IFormSerializedElement[] {
    return this.instance.getAllParameters();
  }

  getParameter(name: string) {
    return this.instance.getParameter(name);
  }

  setParameterImpl(name: string, value: any) {
    return this.instance.setParameter(name, value);
  }

  getItemSelection(): ISelection {
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
    if (this._mode === mode) {
      return;
    }
    const b = this._mode;
    this.modeChanged(mode);
    this.fire('modeChanged', this._mode = mode, b);
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
    const prev = (<any>this.$viewWrapper.node()).previousSibling;
    const scrollToPos = prev ? prev.offsetLeft || 0 : 0;
    const $targid = $(this.$viewWrapper.node()).parent();
    (<any>$targid).scrollTo(scrollToPos, 500, {axis:'x'});
  }

  /**
   * Decide if a chooser for the next view should be shown and if so, which next views are available
   * @param idtype
   * @param range
   */
  private chooseNextViews(idtype: IDType, range: Range) {
    const that = this;

    // show chooser if selection available
    this.$chooser.classed('hidden', range.isNone);

    if(range.isNone) {
      this.$chooser.selectAll('button').classed('active', false);
    }

    findViews(idtype, range).then((views) => {
      const groups = new Map();
      views.forEach((elem) => {
        if(!elem.v.group) { // fallback category if none is present
          elem.v.group = {
            name: TargidConstants.VIEW_FALLBACK_CATEGORY_NAME
          };
        }
        if(!groups.has(elem.v.group.name)) {
          groups.set(elem.v.group.name, [elem]);
        } else {
          groups.get(elem.v.group.name).push(elem);
        }
      });

      const groupsArray = Array.from(groups);

      const orderDescs = listPlugins('chooserConfig').map((desc) => desc.order);

      function orderAlphabetically(a: string, b: string): number {
        const firstKey = a.toLowerCase();
        const secondKey = b.toLowerCase();

        // firstKey alphabetically before secondKey? sort firstKey at lower index or vice versa
        // else the keys are equal
        return firstKey < secondKey? -1 : firstKey > secondKey? 1 : 0;
      }

      let sortedGroups = null;
      // order groups by defined weights if they exist
      if(orderDescs.length) {
        const categoryOrder = Object.assign({}, ...orderDescs);
        sortedGroups = groupsArray.sort((a, b) => {
          const firstOrder: number = categoryOrder[a[0]];
          const secondOrder: number = categoryOrder[b[0]];

          // no order numbers provided -> sort alphabetically by keys
          if(firstOrder === undefined || secondOrder === undefined || firstOrder === secondOrder) {
            return orderAlphabetically(a[0], b[0]);
          }

          return firstOrder - secondOrder;
        });
      } else {
        // order groups alphabetically as a fallback
        sortedGroups = groupsArray.sort((a, b) => orderAlphabetically(a[0], b[0]));
      }

      const $categories = this.$chooser.selectAll('div.category').data(sortedGroups);

      $categories.enter().append('div').classed('category', true).append('header').append('h1').text((d) => d[0]);
      $categories.exit().remove();

      // sort data that buttons inside groups are sorted
      const $buttons = $categories.selectAll('button').data((d: [ string, {enabled: boolean, v: IViewPluginDesc}[] ]) => d[1].sort((a, b) => {
        const firstOrder: number = a.v.group.order;
        const secondOrder: number = b.v.group.order;

        // no order numbers provided -> sort alphabetically by keys
        if(firstOrder === undefined || secondOrder === undefined || firstOrder === secondOrder) {
          return orderAlphabetically(a.v.name, b.v.name);
        }

        return firstOrder - secondOrder;
      }));

      $buttons.enter().append('button')
        .classed('btn btn-default', true);

      $buttons.attr('data-viewid', (d) => d.v.id);
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

  setActiveNextView(viewId?: string) {
    const chooser = (<HTMLElement>this.$chooser.node());
    //disable old don't use d3 to don't screw up the data binding
    Array.from(chooser.querySelectorAll('button.active')).forEach((d: HTMLElement) => d.classList.remove('active'));
    if (viewId) {
      const button = chooser.querySelector(`button[data-viewid="${viewId}"]`);
      if (button) {
        button.classList.add('active');
      }
    }
  }

  get desc() {
    return toViewPluginDesc(this.plugin.desc);
  }

  get mode() {
    return this._mode;
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

export function createContext(graph:ProvenanceGraph, desc: IPluginDesc, ref: IObjectRef<any>):IViewContext {
  return {
    graph,
    desc: toViewPluginDesc(desc),
    ref
  };
}

export function createViewWrapper(graph: ProvenanceGraph, selection: ISelection, parent:Element, plugin:IPluginDesc, options?) {
  return plugin.load().then((p) => new ViewWrapper(graph, selection, parent, p, options));
}

export function replaceViewWrapper(existingView:ViewWrapper, selection: ISelection, plugin:IPluginDesc, options?) {
  return plugin.load().then((p) => existingView.replaceView(selection, p, options));
}
