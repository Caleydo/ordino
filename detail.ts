/**
 * Created by Samuel Gratzl on 16.12.2015.
 */

import C = require('../caleydo_core/main');
import vis = require('../caleydo_core/vis');
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');
import datatypes = require('../caleydo_core/datatype');

export class DetailView {
  private s = this.select.bind(this);

  node: HTMLDivElement;

  constructor(private data: datatypes.IDataType, parent: Element) {
    this.node = document.createElement('div');
    C.onDOMNodeRemoved(this.node, this.destroy.bind(this));
    parent.appendChild(this.node);
    data.on('select-selected', this.s);
  }

  private destroy() {
    this.data.off('select-selected', this.s);
  }

  private select(event: any, range : ranges.Range) {
    this.node.innerText = range.toString();
  }
}

export function create(data: datatypes.IDataType, parent: Element) {
  return new DetailView(data, parent);
}
