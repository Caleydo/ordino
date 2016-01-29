/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import prov = require('../caleydo_provenance/main');
import {EventHandler} from '../caleydo_core/event';
import {IPluginDesc,IPlugin} from '../caleydo_core/plugin';


export enum EViewMode {
  FOCUS, CONTEXT, HIDDEN
}

export interface IView {
  node: Element;

  modeChanged(mode: EViewMode);

  destroy();
}

export class AView implements IView {
  protected $node : d3.Selection<IView>;

  constructor(protected graph: prov.ProvenanceGraph, parent: Element) {
    this.$node = d3.select(parent).append('div').datum(this);
  }


  modeChanged(mode: EViewMode) {
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
  private $node : d3.Selection<ViewWrapper>;

  private mode_ : EViewMode = null;

  private instance : IView = null;

  constructor(protected graph: prov.ProvenanceGraph, parent: Element, private plugin : IPlugin) {
    super();
    this.$node = d3.select(parent).append('div').classed('view', true).datum(this);
    this.instance = plugin.factory(graph, this.node);
  }

  set mode(mode: EViewMode) {
    if (this.mode_ === mode) {
      return;
    }
    const b = this.mode_;
    this.modeChanged(mode);
    this.fire('modeChanged', this.mode_ = mode, b);
  }

  protected modeChanged(mode: EViewMode) {
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

export function createWrapper(graph: prov.ProvenanceGraph, parent: Element, plugin: IPluginDesc) {
  return plugin.load().then((p) => new ViewWrapper(graph, parent, p));
}
