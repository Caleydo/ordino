/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import prov = require('../caleydo_provenance/main');
import {IEventHandler, EventHandler} from "../caleydo_core/event";
import {IPluginDesc} from "../caleydo_core/plugin";


export enum EViewMode {
  FOCUS, CONTEXT, HIDDEN
}

export interface IView extends IEventHandler {
  node: Element;
  mode: EViewMode;

  desc: IPluginDesc;

  destroy();
}

export class AView extends EventHandler implements IView {
  protected $node : d3.Selection<IView>;

  private mode_ = EViewMode.FOCUS;

  constructor(protected graph: prov.ProvenanceGraph, parent: Element, public desc: IPluginDesc) {
    super();
    this.$node = d3.select(parent).append('div').classed('view', true).datum(this);
  }

  set mode(mode: EViewMode) {
    if (this.mode_ === mode) {
      return;
    }
    const b = this.mode_;
    this.modeChanged(this.mode);
    this.fire('modeChanged', this.mode_ = mode, b);
  }

  protected modeChanged(mode: EViewMode) {
    //hook
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
}
