/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import prov = require('../caleydo_provenance/main');
import {AView, EViewMode} from './AView';
import {IPluginDesc} from "../caleydo_core/plugin";


export class SimpleView extends AView {
  constructor(graph: prov.ProvenanceGraph, parent: Element, desc: IPluginDesc) {
    super(graph, parent, desc);
    this.$node.classed('simple', true);

    this.build();
  }

  private build() {
    this.$node.text('Test');
  }

  modeChanged(mode: EViewMode) {
    super.modeChanged(mode);
    this.$node.text('Test ' + mode);
  }
}

export function create(graph: prov.ProvenanceGraph, parent: Element, desc: IPluginDesc) {
  return new SimpleView(graph, parent, desc);
}


