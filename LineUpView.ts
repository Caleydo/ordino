/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="./tsd.d.ts" />

import {AView, EViewMode, IViewContext, ISelection} from './View';
import lineup = require('lineupjs');
import d3 = require('d3');
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');
import tables = require('../caleydo_core/table');
import {IEvent} from '../caleydo_core/event';

export function numberCol(col:string, rows:any[], label = col) {
  return {
    type: 'number',
    column: col,
    label: label,
    domain: d3.extent(rows, (d) => d[col])
  };
}

export function stringCol(col:string, label = col) {
  return {
    type: 'string',
    column: col,
    label: label
  };
}

export function deriveCol(col: tables.IVector) {
  var r:any = {
    column: col.desc.name
  };
  const desc = <any>col.desc;
  if (desc.color) {
    r.color = desc.color;
  } else if (desc.cssClass) {
    r.cssClass = desc.cssClass;
  }
  var val = desc.value;
  switch (val.type) {
    case 'string':
      r.type = 'string';
      break;
    case 'categorical':
      r.type = 'categorical';
      r.categories = desc.categories;
      break;
    case 'real':
    case 'int':
      r.type = 'number';
      r.domain = val.range;
      break;
    default:
      r.type = 'string';
      break;
  }
  return r;
}



export class ALineUpView extends AView {
  private config = {
    renderingOptions: {
      histograms: true
    },
    header: {
      rankingButtons: this.lineupRankingButtons.bind(this)
    },
    body: {
      freezeCols: 2
    }
  };


  protected lineup:any;

  private idtype:idtypes.IDType;
  private selectionHelper = {
    id2index : d3.map<number>(),
    rows: [],
    idAccessor: (x) => x
  };

  private dump: any = null;

  constructor(context:IViewContext, parent:Element, options?) {
    super(context, parent, options);
    this.$node.classed('lineup', true);
  }

  private lineupRankingButtons($node: d3.Selection<any>) {
    $node.append('button').attr('class', 'fa fa-download').on('click', (ranking) => {
      this.lineup.data.exportTable(ranking, { separator: ';', quote: true}).then((content) => {
        var downloadLink = document.createElement('a');
        var blob = new Blob([content], {type: 'text/csv;charset=utf-8'});
        downloadLink.href = URL.createObjectURL(blob);
        (<any>downloadLink).download = 'export.csv';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    });
    $node.append('button').attr('class', 'fa fa-plus').on('click', (d) => {
      //TODO add column dialog
    });
  }

  protected buildLineUpFromTable(table: tables.ITable) {
    const columns = table.cols().map(deriveCol);
    lineup.deriveColors(columns);
    return Promise.all([<any>table.objects(), table.rowIds()]).then((args: any) => {
      const rows : any[] = args[0];
      const rowIds : ranges.Range = args[1];

      const storage = lineup.createLocalStorage(rows, columns);
      this.lineup = lineup.create(storage, this.node, this.config);
      this.lineup.update();
      this.initSelection(rowIds.dim(0).asList(), (x) => x, table.idtypes[0]);
      return this.lineup;
    });
  }

  protected replaceLineUpDataFromTable(table: tables.ITable) {
    return Promise.all([<any>table.objects(), table.rowIds()]).then((args: any) => {
      const rows : any[] = args[0];
      const rowIds : ranges.Range = args[1];
      const dump = this.lineup.dump();
      const storage = lineup.createLocalStorage(rows, this.lineup.data.columns);
      storage.restore(dump);
      this.lineup.changeDataStorage(storage);
      this.updateSelection(rowIds.dim(0).asList());
      return this.lineup;
    });
  }

  protected buildLineUp(rows:any[], columns:any[], idtype:idtypes.IDType, idAccessor:(row:any) => number) {
    lineup.deriveColors(columns);
    const storage = lineup.createLocalStorage(rows, columns);
    this.lineup = lineup.create(storage, this.node,  this.config);
    this.lineup.update();

    if (idAccessor) {
      this.initSelection(rows, idAccessor, idtype);
    }

    return this.lineup;
  }

  protected replaceLineUpData(rows: any[]) {
    const dump = this.lineup.dump();
    const storage = lineup.createLocalStorage(rows, this.lineup.data.columns);
    storage.restore(dump);
    this.lineup.changeDataStorage(storage);
    this.updateSelection(rows);
    return this.lineup;
  }

  private initSelection(rows: any[], idAccessor:(row:any) => number, idtype:idtypes.IDType) {
    this.idtype = idtype;

    this.selectionHelper.idAccessor = idAccessor;
    this.selectionHelper.rows = rows;

    this.lineup.on('hoverChanged', (data_index) => {
      var id = null;
      if (data_index < 0) {
        idtype.clear(idtypes.hoverSelectionType);
      } else {
        id = idAccessor(this.selectionHelper.rows[data_index]);
        idtype.select(idtypes.hoverSelectionType, [id]);
      }
    });
    this.lineup.on('multiSelectionChanged', (data_indices) => {
      const ids = ranges.list(data_indices.map((i) => idAccessor(this.selectionHelper.rows[i])));
      if (data_indices.length === 0) {
        idtype.clear(idtypes.defaultSelectionType);
      } else {
        idtype.select(idtypes.defaultSelectionType, ids);
      }
      this.selectItems(idtype, ids);
    });

    //create lookup cache
    rows.forEach((row, i) => {
      this.selectionHelper.id2index.set(String(idAccessor(row)), i);
    });

    this.idtype.on('select-selected', this.listener);
    this.listener(null, this.idtype.selections());
  }

  private updateSelection(rows: any[]) {
    this.selectionHelper.id2index = d3.map<number>();
    //create lookup cache
    rows.forEach((row, i) => {
      this.selectionHelper.id2index.set(String(this.selectionHelper.idAccessor(row)), i);
    });
  }

  private listener = (event:IEvent, act:ranges.Range) => {
    if (!this.lineup) {
      return;
    }
    var indices:number[] = [];
    act.dim(0).forEach((id) => {
      const index = this.selectionHelper.id2index.get(String(id));
      if (typeof index === 'number') {
        indices.push(index);
      }
    });
    this.lineup.data.setSelection(indices);
  };

  destroy() {
    if (this.idtype) {
      this.idtype.off('select-selected', this.listener);
    }
  }

  modeChanged(mode:EViewMode) {
    super.modeChanged(mode);
    if (this.lineup) {
      //collapse all columns
      const data = this.lineup.data;
      if (mode === EViewMode.FOCUS) {
        if (this.dump) {
          data.restore(this.dump);
        }
        this.dump = null;
      } else if (this.dump === null) {
        this.dump = data.dump();
        const r = data.getRankings()[0];
        const s = r.sortCriteria();
        const labelColumn = r.children.filter((c) => c.desc.type === 'string')[0];
        data.clearRankings();
        const new_r = data.pushRanking();
        new_r.push(labelColumn);
        if (s.col !== labelColumn) {
          new_r.push(s.col);
          if (s.col.desc.type === 'stack') {
            s.col.collapse = true;
          }
          s.col.sortByMe(s.asc);
        } else {
          labelColumn.sortByMe(s.asc);
        }
      }
    }
  }
}


export class LineUpView extends ALineUpView {
  constructor(context:IViewContext, selection: ISelection, parent:Element, options?) {
    super(context, parent, options);
    //TODO
    this.build();
  }

  private build() {
    //generate random data
    const rows = d3.range(300).map((i) => ({name: '' + i, id: i, v1: Math.random() * 100, v2: Math.random() * 100}));

    const columns = [stringCol('name'), numberCol('v1', rows), numberCol('v2', rows)];
    const l = this.buildLineUp(rows, columns, idtypes.resolve('DummyRow'), (r) => r.id);
    const r = l.data.pushRanking();
    l.data.push(r, columns[0]).setWidth(130);
    const stack = l.data.push(r, lineup.model.createStackDesc('Combined'));
    stack.push(l.data.create(columns[1]));
    stack.push(l.data.create(columns[2]));
    l.update();
    stack.sortByMe();
  }
}


export function create(context:IViewContext, selection: ISelection, parent:Element, options?) {
  return new LineUpView(context, selection, parent, options);
}


