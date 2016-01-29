/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import prov = require('../caleydo_provenance/main');
import {AView} from './View';


export class LineUpView extends AView {
  constructor(graph: prov.ProvenanceGraph, parent: Element) {
    super(graph, parent);
    this.$node.classed('lineup', true);
    this.build();
  }

  private build() {
    this.$node.html('<div>LineUp</div>');
  }
}

export function create(graph: prov.ProvenanceGraph, parent: Element) {
  return new LineUpView(graph, parent);
}


