/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="./tsd.d.ts" />

import {AView, EViewMode, IViewContext, ISelection} from './View';
import lineup = require('lineupjs');
import d3 = require('d3');
import idtypes = require('../caleydo_core/idtype');
import tables = require('../caleydo_core/table');
import ranges = require('../caleydo_core/range');
import plugins = require('../caleydo_core/plugin');
import dialogs = require('../caleydo_bootstrap_fontawesome/dialogs');
import cmds = require('./LineUpCommands');
import {IEvent} from '../caleydo_core/event';
import {saveNamedSet} from './storage';

export function numberCol(col:string, rows:any[], label = col) {
  return {
    type: 'number',
    column: col,
    label: label,
    domain: d3.extent(rows, (d) => d[col])
  };
}

export function numberCol2(col:string, min: number, max: number, label = col) {
  return {
    type: 'number',
    column: col,
    label: label,
    domain: [min, max]
  };
}


export function categoricalCol(col:string, categories: string[], label = col) {
  return {
    type: 'categorical',
    column: col,
    label: label,
    categories: categories
  };
}


export function stringCol(col:string, label = col) {
  return {
    type: 'string',
    column: col,
    label: label
  };
}

export function booleanCol(col:string, label = col) {
  return {
    type: 'boolean',
    column: col,
    label: label
  };
}




export function useDefaultLayout(instance: any) {
  instance.data.deriveDefault();
  //insert selection column
  instance.data.insert(instance.data.getRankings()[0], 1, lineup.model.createSelectionDesc());
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
    }
  };


  protected lineup:any;

  private idType:idtypes.IDType;
  private selectionHelper = {
    id2index : d3.map<number>(),
    rows: [],
    idAccessor: (x) => x
  };
  private scoreAccessor = (row: any, id: string, desc: any) => desc.scores ? desc.scores[this.selectionHelper.idAccessor(row)]: null;

  private dump: any = null;

  resolver: (d: any) => void;

  constructor(context:IViewContext, parent:Element, options?) {
    super(context, parent, options);
    this.$node.classed('lineup', true);

    this.context.ref.value.data = new Promise((resolve) => {
      this.resolver = resolve;
    });
    //context.graph.findOrAddObject()
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
    $node.append('button').attr('class', 'fa fa-save').on('click', (ranking) => {
      this.saveRanking(ranking.getOrder());
    });

    const $div = $node.append('div');
    $div.append('button').attr('class', 'fa fa-plus dropdown-toggle').attr('data-toggle','dropdown');
    const $ul = $div.append('ul').attr('class', 'dropdown-menu');

    const columns = this.lineup.data.getColumns().filter((d) => !d._score);
    $ul.selectAll('li.col').data(columns).enter().append('li').classed('col',true).append('a').attr('href','#').text((d: any) => d.label).on('click', (d) => {
      const ranking = this.lineup.data.getLastRanking();
      this.lineup.data.push(ranking, d);
      d3.event.preventDefault();
    });

    $ul.append('li').classed('divider', true);

    const scores = plugins.list('targidScore').filter((d: any) => d.idtype === this.idType.id);
    $ul.selectAll('li.score').data(scores).enter().append('li').classed('score',true).append('a').attr('href','#').text((d) => d.name).on('click', (d) => {
      d.load().then((p) => {
        this.pushScore(p);
      });
      d3.event.preventDefault();
    });

  }

  protected buildLineUpFromTable(table: tables.ITable) {
    const columns = table.cols().map(deriveCol);
    lineup.deriveColors(columns);
    return Promise.all([<any>table.objects(), table.rowIds()]).then((args: any) => {
      const rows : any[] = args[0];
      const rowIds : ranges.Range = args[1];

      const storage = lineup.createLocalStorage(rows, columns);
      this.idType = table.idtypes[0];
      this.lineup = lineup.create(storage, this.node, this.config);
      this.lineup.update();
      this.initSelection(rowIds.dim(0).asList(), (x) => x, table.idtypes[0]);
      return this.lineup;
    });
  }

  private updateRef(storage) {
    if (this.resolver) {
      this.resolver(storage);
      this.resolver = null;
    }
    this.context.ref.value.data = Promise.resolve(storage);
  }

  protected replaceLineUpDataFromTable(table: tables.ITable) {
    return Promise.all([<any>table.objects(), table.rowIds()]).then((args: any) => {
      const rows : any[] = args[0];
      const rowIds : ranges.Range = args[1];
      this.lineup.data.setData(rows);
      this.updateSelection(rowIds.dim(0).asList());
      return this.lineup;
    });
  }

  protected buildLineUp(rows:any[], columns:any[], idtype:idtypes.IDType, idAccessor:(row:any) => number) {
    lineup.deriveColors(columns);
    const storage = lineup.createLocalStorage(rows, columns);
    this.idType = idtype;
    this.lineup = lineup.create(storage, this.node,  this.config);
    this.lineup.update();

    if (idAccessor) {
      this.initSelection(rows, idAccessor, idtype);
    }

    return this.lineup;
  }

  protected initializedLineUp() {
    this.updateRef(this.lineup.data);
    cmds.clueify(this.context.ref, this.context.graph);
  }

  protected replaceLineUpData(rows: any[]) {
    this.lineup.data.setData(rows);
    this.updateSelection(rows);
    return this.lineup;
  }

  private initSelection(rows: any[], idAccessor:(row:any) => number, idType:idtypes.IDType) {
    this.idType = idType;

    this.selectionHelper.idAccessor = idAccessor;
    this.selectionHelper.rows = rows;

    this.lineup.on('hoverChanged', (data_index) => {
      var id = null;
      if (data_index < 0) {
        idType.clear(idtypes.hoverSelectionType);
      } else {
        id = idAccessor(this.selectionHelper.rows[data_index]);
        idType.select(idtypes.hoverSelectionType, [id]);
      }
    });
    this.lineup.on('multiSelectionChanged', (data_indices) => {
      const ids = ranges.list(data_indices.map((i) => idAccessor(this.selectionHelper.rows[i])));
      if (data_indices.length === 0) {
        idType.clear(idtypes.defaultSelectionType);
      } else {
        idType.select(idtypes.defaultSelectionType, ids);
      }
      this.selectItems(idType, ids);
    });

    //create lookup cache
    rows.forEach((row, i) => {
      this.selectionHelper.id2index.set(String(idAccessor(row)), i);
    });

    this.idType.on('select-selected', this.listener);
    this.listener(null, this.idType.selections());
  }

  private updateSelection(rows: any[]) {
    this.selectionHelper.id2index = d3.map<number>();
    this.selectionHelper.rows = rows;
    //create lookup cache
    rows.forEach((row, i) => {
      this.selectionHelper.id2index.set(String(this.selectionHelper.idAccessor(row)), i);
    });
  }

  pushScore(score: plugins.IPlugin, ranking = this.lineup.data.getLastRanking()) {
    //TODO clueify
    Promise.resolve(score.factory()).then((scoreImpl) => {
      const desc = scoreImpl.createDesc();
      desc._score = score;
      desc.accessor = this.scoreAccessor;
      this.lineup.data.pushDesc(desc);
      this.lineup.data.push(ranking, desc);
      return scoreImpl.compute([], this.idType).then((scores) => {
        desc.scores = scores;
        this.lineup.update();
      });
    });
  }

  saveRanking(order: number[]) {
    const r = this.selectionHelper.rows;
    const acc = this.selectionHelper.idAccessor;
    const ids = ranges.list(order.map((i) => acc(r[i])).sort(d3.ascending));
    const dialog = dialogs.generateDialog('Save Named Set', 'Save');
    dialog.body.innerHTML = `<form>
            <div class="form-group">
              <label for="namedset_name">Name</label>
              <input type="text" class="form-control" id="namedset_name" placeholder="Name" required="required">
            </div>
            <div class="form-group">
              <label for="namedset_description">Description</label>
              <textarea class="form-control" id="namedset_description" rows="5" placeholder="Description"></textarea>
            </div>
          </form>`;
     (<HTMLFormElement>dialog.body.querySelector('form')).onsubmit = () => {
       dialog.hide();
       return false;
     };
     dialog.onHide(() => {
       const name = (<HTMLInputElement>dialog.body.querySelector('#namedset_name')).value;
       const description = (<HTMLTextAreaElement>dialog.body.querySelector('#namedset_description')).value;
       saveNamedSet(name, this.idType, ids, description).then((d) => console.log('saved', d));
       dialog.destroy();
     });
     dialog.show();
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
    if (this.idType) {
      this.idType.off('select-selected', this.listener);
    }
  }

  modeChanged(mode:EViewMode) {
    super.modeChanged(mode);
    if (this.lineup) {
      //collapse all columns
      const data = this.lineup.data;
      if (mode === EViewMode.FOCUS) {
        if (this.dump) {
          const r = data.getRankings()[0];
          r.children.forEach((c) => {
            if (c.id in this.dump) {
              c.setWidth(this.dump[c.id]);
            }
          });
        }
        this.dump = null;
      } else if (this.dump === null) {
        const r = data.getRankings()[0];
        const s = r.getSortCriteria();
        const labelColumn = r.children.filter((c) => c.desc.type === 'string')[0];

        this.dump = {};
        r.children.forEach((c) => {
          if (c === labelColumn || c === s.col || c.desc.type === 'rank' || c.desc.type === 'selection') {
            //keep
          } else {
            this.dump[c.id] = c.getWidth();
            c.setWidth(0);
          }
        });
      }
    }
  }
}

export interface IScore<T> {
  createDesc(): any;
  compute(ids: ranges.Range|number[], idtype: idtypes.IDType): Promise<{ [id:string]: T }>;
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


