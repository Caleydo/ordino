/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import prov = require('../caleydo_provenance/main');
import {AView} from './AView';
import {IPluginDesc} from "../caleydo_core/plugin";


export class LineUpView extends AView {
  constructor(graph: prov.ProvenanceGraph, parent: Element, desc: IPluginDesc) {
    super(graph, parent, desc);
    this.$node.classed('lineup', true);
    this.build();
  }

  private build() {
    this.$node.text('LineUp');
  }
}

export function create(graph: prov.ProvenanceGraph, parent: Element, desc: IPluginDesc) {
  return new LineUpView(graph, parent, desc);
}


