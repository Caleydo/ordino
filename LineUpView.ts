/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="./tsd.d.ts" />

import C = require('../caleydo_core/main');
import prov = require('../caleydo_provenance/main');
import {AView, EViewMode} from './View';
import lineup = require('lineupjs');
import d3 = require('d3');

export function numberCol(col:string, rows: any[], label = col) {
  return {
    type: 'number',
    column: col,
    label: col,
    domain: d3.extent(rows, (d) => d[col])
  }
}

export function stringCol(col:string, label = col) {
  return {
    type: 'string',
    column: col,
    label: col
  }
}

export class ALineUpView extends AView {
  protected lineup:any;

  constructor(graph:prov.ProvenanceGraph, parent:Element) {
    super(graph, parent);
    this.$node.classed('lineup', true);
  }

  protected buildLineUp(rows:any[], columns:any[]) {
    lineup.deriveColors(columns);
    const storage = lineup.createLocalStorage(rows, columns);
    this.lineup = lineup.create(storage, this.node);
    this.lineup.update();
    return this.lineup;
  }

  modeChanged(mode:EViewMode) {
    super.modeChanged(mode);
    if (this.lineup) {
      //collapse all columns
      const compress = mode != EViewMode.FOCUS;
      this.lineup.data.getRankings().forEach((r) => {
        r.children.forEach((col,i) => {
          if (i>0) {
            col.compressed = compress;
          }
        });
      });
    }
  }
}


export class LineUpView extends ALineUpView {
  constructor(graph:prov.ProvenanceGraph, parent:Element) {
    super(graph, parent);
    //TODO
    this.build();
  }

  private build() {
    //generate random data
    const rows = d3.range(300).map((i) => ({ name: 'Row#'+i, v1: Math.random()*100, v2: Math.random()*100}));

    const columns = [stringCol('name'), numberCol('v1', rows), numberCol('v2', rows)];
    const l = this.buildLineUp(rows, columns);
    const r = l.data.pushRanking();
    l.data.push(r,columns[0]).setWidth(130);
    const stack = l.data.push(r,lineup.model.createStackDesc('Combined'));
    stack.push(l.data.create(columns[1]));
    stack.push(l.data.create(columns[2]));
    l.update();
    stack.sortByMe();
  }
}


export function create(graph:prov.ProvenanceGraph, parent:Element) {
  return new LineUpView(graph, parent);
}


