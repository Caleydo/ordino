/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import {ProvenanceGraph, IObjectRef} from 'phovea_core/src/provenance';
import {IDType, resolve, defaultSelectionType} from 'phovea_core/src/idtype';
import {Range, none} from 'phovea_core/src/range';
import * as d3 from 'd3';
import TargidConstants from './constants';
import {EventHandler, IEventHandler} from 'phovea_core/src/event';
import {IPluginDesc, list as listPlugins} from 'phovea_core/src/plugin';


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
 * The seleted items itself are not considered in this function.
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

  readonly node: Element;
  readonly context:IViewContext;
  readonly idType: IDType;
  readonly itemIDType: IDType|null;

  init(): void;

  changeSelection(selection: ISelection): void;

  setItemSelection(selection: ISelection): void;

  getItemSelection(): ISelection;

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>): void;

  getParameter(name: string): any;

  setParameter(name: string, value: any);

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

  readonly idType: IDType;

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

  get itemIDType() {
    return this.itemSelection.idtype;
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


export function createContext(graph:ProvenanceGraph, desc: IPluginDesc, ref: IObjectRef<any>):IViewContext {
  return {
    graph,
    desc: toViewPluginDesc(desc),
    ref
  };
}
