/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import prov = require('../caleydo_provenance/main');
import {EventHandler, IEventHandler} from '../caleydo_core/event';
import {IPluginDesc,IPlugin} from '../caleydo_core/plugin';
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');


export enum EViewMode {
  FOCUS, CONTEXT, HIDDEN
}

export interface IViewContext {
  graph: prov.ProvenanceGraph;
  idtype: idtypes.IDType;
  selection: ranges.Range;
}

export interface IView extends IEventHandler {
  //constructor(context: IViewContext, parent: Element, options?);

  node: Element;

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

  constructor(protected context:IViewContext, parent:Element, options?) {
    super();
    this.$node = d3.select(parent).append('div').datum(this);
  }

  protected selectItems(idtype:idtypes.IDType, range:ranges.Range) {
    this.fire(AView.EVENT_SELECT, idtype, range);
  }

  modeChanged(mode:EViewMode) {
    //hook
  }


  destroy() {
    this.$node.remove();
  }

  get node() {
    return <Element>this.$node.node();
  }
}

export class ViewWrapper extends EventHandler {
  private $node:d3.Selection<ViewWrapper>;

  private mode_:EViewMode = null;

  private instance:IView = null;

  constructor(protected context:IViewContext, parent:Element, private plugin:IPlugin, options?) {
    super();
    this.$node = d3.select(parent).append('div').classed('view', true).datum(this);
    this.instance = plugin.factory(context, this.node, options);
    super.propagate(this.instance, 'select');
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
    this.instance.modeChanged(mode);
  }

  get desc() {
    return this.plugin.desc;
  }

  get mode() {
    return this.mode_;
  }

  destroy() {
    this.instance.destroy();
    this.$node.remove();
  }

  get node() {
    return <Element>this.$node.node();
  }

  remove() {
    this.fire('remove', this);
  }

  focus() {
    this.fire('focus', this);
  }
}

export function createContext(graph:prov.ProvenanceGraph, idtype?:idtypes.IDType, selection?:ranges.Range):IViewContext {
  return {
    graph: graph,
    idtype: idtype,
    selection: selection
  };
}

export function createWrapper(context:IViewContext, parent:Element, plugin:IPluginDesc, options?) {
  return plugin.load().then((p) => new ViewWrapper(context, parent, p, options));
}
