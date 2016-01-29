/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import prov = require('../caleydo_provenance/main');
import {AView, EViewMode} from './View';


export class SimpleView extends AView {
  constructor(graph: prov.ProvenanceGraph, parent: Element) {
    super(graph, parent);
    this.$node.classed('simple', true);

    this.build();
  }

  private build() {
    this.$node.html('<div>Test</div>');
  }

  modeChanged(mode: EViewMode) {
    super.modeChanged(mode);
    this.$node.select('div').text('Test ' + mode);
  }
}

export function create(graph: prov.ProvenanceGraph, parent: Element) {
  return new SimpleView(graph, parent);
}


