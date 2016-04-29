/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import prov = require('../caleydo_clue/prov');
import {EventHandler, IEventHandler} from '../caleydo_core/event';
import {IPluginDesc,IPlugin, list as listPlugins} from '../caleydo_core/plugin';
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');
import ajax = require('../caleydo_core/ajax');
import C = require('../caleydo_core/main');



export enum EViewMode {
  FOCUS, CONTEXT, HIDDEN
}

export interface IViewPluginDesc extends IPluginDesc {
  selection: string; //none, single, multiple
  idtype?: string;
  mockup?: boolean;
}

function toViewPluginDesc(p : IPluginDesc): IViewPluginDesc {
  var r : any = p;
  r.selection = r.selection || 'none';
  return r;
}


export function findStartViews() : IViewPluginDesc[] {
  return listPlugins('targidView').filter((d: any) => d.selection === 'none').map(toViewPluginDesc);
}

export function findViews(idtype:idtypes.IDType, selection:ranges.Range) : Promise<IViewPluginDesc[]> {
  const selectionType = idtype === null || selection.isNone ? 'none' : selection.dim(0).length === 1 ? 'single' : 'multiple';
  return idtype.getCanBeMappedTo().then((mappedTypes) => {
    const all = [idtype].concat(mappedTypes);
    function byType(p: any) {
      const pattern = p.idtype ? new RegExp(p.idtype) : /.*/;
      return p.selection === selectionType && (selectionType === 'none' || all.some((i) => pattern.test(i.id)));
    }
    return listPlugins('targidView').filter(byType).map(toViewPluginDesc);
  });
}

export interface ISelection {
  idtype: idtypes.IDType;
  range: ranges.Range;
}

export interface IViewContext {
  graph: prov.ProvenanceGraph;
}

export interface IView extends IEventHandler {
  //constructor(context: IViewContext, selection: ISelection, parent: Element, options?);

  node: Element;
  context:IViewContext;

  changeSelection(selection: ISelection);

  modeChanged(mode:EViewMode);

  destroy();
}

export class AView extends EventHandler implements IView {
  /**
   * event when one or more elements are selected for the next level
   * @type {string}
   * @argument idtype {IDType}
   * @argument range {Range}
   */
  static EVENT_SELECT = 'select';

  protected $node:d3.Selection<IView>;

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

  protected selectItems(idtype:idtypes.IDType, range:ranges.Range) {
    this.fire(AView.EVENT_SELECT, idtype, range);
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

export class ViewWrapper extends EventHandler {
  static EVENT_OPEN = 'open';
  static EVENT_FOCUS = 'focus';
  static EVENT_REMOVE = 'remove';

  private $node:d3.Selection<ViewWrapper>;
  private $chooser:d3.Selection<ViewWrapper>;

  private mode_:EViewMode = null;

  private instance:IView = null;

  private listener = (event: any, idtype:idtypes.IDType, range:ranges.Range) => {
    this.chooseNextViews(idtype, range);
    this.fire(AView.EVENT_SELECT, idtype, range);
  };

  constructor(public context:IViewContext, public selection: ISelection, parent:Element, private plugin:IPlugin, options?) {
    super();
    this.$node = d3.select(parent).append('div').classed('view', true).datum(this);
    this.$chooser = d3.select(parent).append('div').classed('chooser', true).datum(this).style('display', 'none');

    this.instance = plugin.factory(context, selection, this.node, options);
    this.instance.on(AView.EVENT_SELECT, this.listener);
  }

  setSelection(selection: ISelection) {
    this.selection = selection;
    this.instance.changeSelection(selection);
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
    this.$node
      .classed('t-hide', mode === EViewMode.HIDDEN)
      .classed('t-focus', mode === EViewMode.FOCUS)
      .classed('t-context', mode === EViewMode.CONTEXT);
    this.$chooser
      .classed('t-hide', mode === EViewMode.HIDDEN);
    this.instance.modeChanged(mode);
  }

  private chooseNextViews(idtype: idtypes.IDType, selection: ranges.Range) {
    const isNone = selection.isNone;
    this.$chooser.style('display', isNone ? 'none' : null);

    const viewPromise = isNone ? Promise.resolve([]) : findViews(idtype, selection);
    viewPromise.then((views) => {
      //group views by category
      const data = d3.nest().key((d) => (<any>d).category || 'static').entries(views);
      const $categories = this.$chooser.selectAll('div.category').data(data);
      $categories.enter().append('div').classed('category', true).append('span');
      $categories.select('span').text((d) => d.key);
      const $buttons = $categories.selectAll('button').data((d) => <IViewPluginDesc[]>d.values);
      $buttons.enter().append('button');
      $buttons.text((d) => d.name).on('click', (d) => {
        this.fire(ViewWrapper.EVENT_OPEN, d.id, idtype, selection);
      });
      $buttons.attr('disabled', (d) => d.mockup ? 'disabled' : null);
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
    this.instance.off(AView.EVENT_SELECT, this.listener);
    this.instance.destroy();
    this.$node.remove();
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

export function createContext(graph:prov.ProvenanceGraph):IViewContext {
  return {
    graph: graph
  };
}

export function createWrapper(context:IViewContext, selection: ISelection, parent:Element, plugin:IPluginDesc, options?) {
  if ((<any>plugin).proxy || (<any>plugin).site) {
    //inline proxy
    return Promise.resolve(new ViewWrapper(context, selection, parent, {
      desc: plugin,
      factory: (context, selection, node, options) => new ProxyView(context, selection, node, plugin, options)
    }, options));
  }
  return plugin.load().then((p) => new ViewWrapper(context, selection, parent, p, options));
}
