/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="./tsd.d.ts" />

import {AView, EViewMode, IViewContext, ISelection, ViewWrapper} from './View';
import lineup = require('lineupjs');
import d3 = require('d3');
import idtypes = require('../caleydo_core/idtype');
import tables = require('../caleydo_core/table');
import ranges = require('../caleydo_core/range');
import plugins = require('../caleydo_core/plugin');
import dialogs = require('../caleydo_bootstrap_fontawesome/dialogs');
import cmds = require('./LineUpCommands');
import {saveNamedSet} from './storage';

export function numberCol(col:string, rows:any[], label = col) {
  return {
    type: 'number',
    column: col,
    label: label,
    domain: d3.extent(rows, (d) => d[col]),
    color: ''
  };
}

export function numberCol2(col:string, min:number, max:number, label = col) {
  return {
    type: 'number',
    column: col,
    label: label,
    domain: [min, max],
    color: ''
  };
}


export function categoricalCol(col:string, categories:string[], label = col) {
  return {
    type: 'categorical',
    column: col,
    label: label,
    categories: categories,
    color: ''
  };
}


export function stringCol(col:string, label = col) {
  return {
    type: 'string',
    column: col,
    label: label,
    color: ''
  };
}

export function booleanCol(col:string, label = col) {
  return {
    type: 'boolean',
    column: col,
    label: label,
    color: ''
  };
}


export function useDefaultLayout(instance:any) {
  instance.data.deriveDefault();
  //insert selection column
  instance.data.insert(instance.data.getRankings()[0], 1, lineup.model.createSelectionDesc());
}

export function deriveCol(col:tables.IVector) {
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

function handleNamedFilter(options:any, columns, rows) {
  const filter = (options && options.filter ? ranges.parse(options.filter) : ranges.none()).dim(0);
  if (!filter.isNone && !filter.isAll) {
    columns.splice(1, 0, booleanCol('_checked', options && options.filterName ? options.filterName : 'F'));
    rows.forEach((row) => row._checked = filter.contains(row._id));
  }
}
function useNamedFilter(options, lineup) {
  if (options && options.filter) {
    //activate the filter to be just the checked ones
    const f = lineup.data.find((col) => col.desc.type === 'boolean' && col.desc.column === '_checked');
    if (f) {
      f.setFilter(true);
    }
  }
}

export class ALineUpView extends AView {
  private config = {
    renderingOptions: {
      histograms: true
    },
    header: {
      rankingButtons: this.lineupRankingButtons.bind(this)
    },
    body: {}
  };

  protected $nodata;
  private $params:d3.Selection<ViewWrapper>;

  protected lineup:any;

  private idType:idtypes.IDType;
  private selectionHelper = {
    id2index: d3.map<number>(),
    rows: [],
    idAccessor: (x) => x
  };
  private scoreAccessor = (row:any, id:string, desc:any) => {
    const row_id = this.selectionHelper.idAccessor(row);
    return (desc.scores && typeof desc.scores[row_id] !== 'undefined') ? desc.scores[row_id] : (typeof desc.missingValue !== 'undefined' ? desc.missingValue : null);
  };

  private dump:any = null;

  resolver:(d:any) => void;

  private orderedSelectionIndicies:number[] = [];

  constructor(context:IViewContext, parent:Element, private options?) {
    super(context, parent, options);
    this.$node.classed('lineup', true);

    this.context.ref.value.data = new Promise((resolve) => {
      this.resolver = resolve;
    });
    //context.graph.findOrAddObject()

    this.$nodata = this.$node.append('p')
      .classed('nodata', true)
      .classed('hidden', true)
      .text('No data found for selection and parameter.');
  }


  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    this.$params = $parent.append('div').classed('form-group', true).append('p');
  }

  private lineupRankingButtons($node:d3.Selection<any>) {
    $node.append('button').attr('class', 'fa fa-download').on('click', (ranking) => {
      this.lineup.data.exportTable(ranking, {separator: ';', quote: true}).then((content) => {
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
    $div.append('button').attr('class', 'fa fa-plus dropdown-toggle').attr('data-toggle', 'dropdown');
    const $ul = $div.append('ul').attr('class', 'dropdown-menu');

    const columns = this.lineup.data.getColumns().filter((d) => !d._score);
    columns.push(lineup.model.createStackDesc());
    $ul.selectAll('li.col').data(columns)
      .enter()
      .append('li').classed('col', true)
      .append('a').attr('href', '#').text((d:any) => d.label)
      .on('click', (d) => {
        const ranking = this.lineup.data.getLastRanking();
        this.lineup.data.push(ranking, d);
        (<Event>d3.event).preventDefault();
      });

    $ul.append('li').classed('divider', true);

    const scores = plugins.list('targidScore').filter((d:any) => d.idtype === this.idType.id);
    $ul.selectAll('li.score').data(scores)
      .enter()
      .append('li').classed('score', true)
      .append('a').attr('href', '#').text((d) => d.name)
      .on('click', (d) => {
        d.load().then((p) => {
          this.pushScore(p);
        });
        (<Event>d3.event).preventDefault();
      });

  }

  protected buildLineUpFromTable(table:tables.ITable) {
    const columns = table.cols().map(deriveCol);
    lineup.deriveColors(columns);
    return Promise.all([<any>table.objects(), table.rowIds()]).then((args:any) => {
      const rows:any[] = args[0];
      const rowIds:ranges.Range = args[1];
      handleNamedFilter(this.options, columns, rows);

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

  protected replaceLineUpDataFromTable(table:tables.ITable) {
    return Promise.all([<any>table.objects(), table.rowIds()]).then((args:any) => {
      const rows:any[] = args[0];
      const rowIds:ranges.Range = args[1];
      this.lineup.data.setData(rows);
      this.updateSelection(rowIds.dim(0).asList());
      return this.lineup;
    });
  }

  protected buildLineUp(rows:any[], columns:any[], idtype:idtypes.IDType, idAccessor:(row:any) => number) {
    handleNamedFilter(this.options, columns, rows);
    lineup.deriveColors(columns);
    const storage = lineup.createLocalStorage(rows, columns);
    this.idType = idtype;
    this.lineup = lineup.create(storage, this.node, this.config);
    this.lineup.update();

    if (idAccessor) {
      this.initSelection(rows, idAccessor, idtype);
    }

    return this.lineup;
  }

  protected initializedLineUp() {
    useNamedFilter(this.options, this.lineup);
    this.updateRef(this.lineup.data);
    cmds.clueify(this.context.ref, this.context.graph);
  }

  protected withoutTracking(f: (lineup: any)=>void) {
    cmds.untrack(this.context.ref).then(f.bind(this, this.lineup)).then(cmds.clueify.bind(cmds, this.context.ref, this.context.graph));
  }

  protected replaceLineUpData(rows:any[]) {
    if(rows.length === 0) {
      console.warn('rows.length ===', rows.length, '--> LineUp does not support empty data and might throw errors');
    }
    this.lineup.data.setData(rows);
    this.updateSelection(rows);
    return this.lineup;
  }

  protected updateMapping(column:string, rows:any[]) {
    const col = this.lineup.data.find((d) => d.desc.type === 'number' && d.desc.column === column);
    if (col) {
      col.setMapping(new lineup.model.ScaleMappingFunction(d3.extent(rows, (d) => d[column])));
    }
  }


  private initSelection(rows:any[], idAccessor:(row:any) => number, idType:idtypes.IDType) {
    this.idType = idType;

    this.selectionHelper.idAccessor = idAccessor;
    this.selectionHelper.rows = rows;

    this.lineup.on('multiSelectionChanged', this.onChange);

    //create lookup cache
    rows.forEach((row, i) => {
      this.selectionHelper.id2index.set(String(idAccessor(row)), i);
    });

    this.updateLineUpStats();
  }

  private onChange = (data_indices) => {
    // compute the difference
    const diffAdded = this.array_diff(data_indices, this.orderedSelectionIndicies);
    const diffRemoved = this.array_diff(this.orderedSelectionIndicies, data_indices);

    // add new element to the end
    if(diffAdded.length > 0) {
      diffAdded.forEach((d) => {
        this.orderedSelectionIndicies.push(d);
      });
    }

    // remove elements within, but preserve order
    if(diffRemoved.length > 0) {
      diffRemoved.forEach((d) => {
        this.orderedSelectionIndicies.splice(this.orderedSelectionIndicies.indexOf(d), 1);
      });
    }

    const ids = ranges.list(this.orderedSelectionIndicies.map((i) => this.selectionHelper.idAccessor(this.selectionHelper.rows[i])));
    //console.log(this.orderedSelectionIndicies, ids.toString(), diffAdded, diffRemoved);

    this.setItemSelection({idtype: this.idType, range: ids});
  };

  /**
   * Returns the all items that are not in the given two arrays
   * TODO improve performance of diff algorithm
   * @param array1
   * @param array2
   * @returns {any}
   */
  private array_diff(array1, array2) {
    return array1.filter(function(elm) {
      return array2.indexOf(elm) === -1;
    });
  }

  setItemSelection(sel:ISelection) {
    if (this.lineup) {
      var indices:number[] = [];
      sel.range.dim(0).forEach((id) => {
        const index = this.selectionHelper.id2index.get(String(id));
        if (typeof index === 'number') {
          indices.push(index);
        }
      });
      this.lineup.on('multiSelectionChanged', null);
      this.lineup.data.setSelection(indices);
      this.lineup.on('multiSelectionChanged', this.onChange);
    }

    this.updateLineUpStats();
    super.setItemSelection(sel);
  }

  private updateSelection(rows:any[]) {
    this.selectionHelper.id2index = d3.map<number>();
    this.selectionHelper.rows = rows;
    //create lookup cache
    rows.forEach((row, i) => {
      this.selectionHelper.id2index.set(String(this.selectionHelper.idAccessor(row)), i);
    });
  }

  pushScore(score:plugins.IPlugin, ranking = this.lineup.data.getLastRanking()) {
    const that = this;

    //TODO clueify
    Promise.resolve(score.factory(score.desc)) // open modal dialog
      .then((scoreImpl) => { // modal dialog is closed and score created
        const desc = scoreImpl.createDesc();
        desc._score = score;
        desc.accessor = this.scoreAccessor;
        this.lineup.data.pushDesc(desc);
        const col = this.lineup.data.push(ranking, desc);

        // get current row order make a copy to reverse it -> will animate the sinus curve in the opposite direction
        const order = that.lineup.data.getLastRanking().getOrder().slice(0).reverse();
        const sinus = Array.apply(null, Array(20)) // create 20 fields
          .map((d, i) => i*0.1) // [0, 0.1, 0.2, ...]
          .map(v => Math.sin(v*Math.PI)); // convert to sinus

        // set column mapping to sinus domain = [-1, 1]
        col.setMapping(new lineup.model.ScaleMappingFunction(d3.extent(<number[]>sinus)));

        var timerId = 0;
        var numAnimationCycle = 0;

        const animateBars = function() {
          const scores = {}; // must be an object!
          order.forEach((id, index) => {
            scores[id] = sinus[(index+numAnimationCycle) % sinus.length];
          });
          desc.scores = scores;
          that.lineup.update();

          // on next animation jump by 5 items
          numAnimationCycle += 5;

          // replay animation
          clearTimeout(timerId);
          timerId = window.setTimeout(function() { animateBars(); }, 1000);
        };

        if(desc.type === 'number') {
          animateBars(); // start animation
        }

        return scoreImpl.compute([], this.idType).then((scores) => {
          clearTimeout(timerId); // stop animation
          desc.scores = scores;
          if (desc.type === 'number' && !(desc.constantDomain)) {
            desc.domain = d3.extent(<number[]>(d3.values(scores)));
            col.setMapping(new lineup.model.ScaleMappingFunction(desc.domain));
          }
          this.lineup.update();
        });
      });
  }

  saveRanking(order:number[]) {
    const r = this.selectionHelper.rows;
    const acc = this.selectionHelper.idAccessor;
    const ids = ranges.list(order.map((i) => acc(r[i])).sort(d3.ascending));
    const dialog = dialogs.generateDialog('Save Named Set');
    dialog.body.innerHTML = `
      <form id="namedset_form">
        <div class="form-group">
          <label for="namedset_name">Name</label>
          <input type="text" class="form-control" id="namedset_name" placeholder="Name" required="required">
        </div>
        <div class="form-group">
          <label for="namedset_description">Description</label>
          <textarea class="form-control" id="namedset_description" rows="5" placeholder="Description"></textarea>
        </div>
      </form>`;

    const form = <HTMLFormElement>dialog.body.querySelector('#namedset_form');

    form.onsubmit = () => {
      const name = (<HTMLInputElement>dialog.body.querySelector('#namedset_name')).value;
      const description = (<HTMLTextAreaElement>dialog.body.querySelector('#namedset_description')).value;
      saveNamedSet(name, this.idType, ids, description).then((d) => {
        console.log('saved', d);
        this.fire(AView.EVENT_UPDATE_ENTRY_POINT, this.idType, d);
      });
      dialog.hide();
      return false;
    };

    dialog.footer.innerHTML = `<button type="submit" form="namedset_form" class="btn btn-default btn-primary">Save</button>`;

    dialog.onHide(() => {
      dialog.destroy();
    });

    dialog.show();
  }

  /**
   * Writes the number of total, selected and shown items in the parameter area
   */
  updateLineUpStats() {

    /**
     * Builds the stats string
     * @param total
     * @param selected
     * @param shown
     * @returns {string}
     */
    const showStats = (total, selected = 0, shown = 0) => {
      var str = 'Showing ';
      if(shown > 0 && total !== shown) {
        str += ` ${shown} of `;
      }
      str += `${total} ${this.getItemName(total)}`;
      if(selected > 0) {
        str += `; ${selected} selected`;
      }
      return str;
    };

    const selected = this.lineup.data.getSelection().length;
    const total = this.lineup.data.data.length;

    const r = this.lineup.data.getRankings()[0];
    if(r) {
      // needs a setTimeout, because LineUp needs time to filter the rows
      const id = setTimeout(() => {
        clearTimeout(id);
        this.lineup.data.view(r.getOrder()).then((data) => {
          const shown = data.length;
          this.$params.html(showStats(total, selected, shown));
        });
      }, 150); // adjust the time depending on the number of rows(?)

    } else {
      this.$params.html(showStats(total, selected));
    }
  }

  getItemName(count: number) {
    return (count === 1) ? 'item' : 'items';
  }

  destroy() {
    // nothing to do
  }

  modeChanged(mode:EViewMode) {
    super.modeChanged(mode);
    if (this.lineup) {
      // collapse all columns
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
          if (c === labelColumn ||
              c === s.col ||
              c.desc.type === 'rank' ||
              c.desc.type === 'selection' ||
              c.desc.column === 'id' // = Ensembl column
          ) {
            // keep these columns
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
  createDesc():any;
  compute(ids:ranges.Range|number[], idtype:idtypes.IDType):Promise<{ [id:string]:T }>;
}


/**
 * Sample LineUp view with random data
 * @deprecated For testing purpose only
 */
export class LineUpView extends ALineUpView {
  constructor(context:IViewContext, selection:ISelection, parent:Element, options?) {
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

/**
 * Factory function that creates a sample LineUp view with random data
 * @deprecated For testing purpose only
 * @param context
 * @param selection
 * @param parent
 * @param options
 * @returns {LineUpView}
 */
export function create(context:IViewContext, selection:ISelection, parent:Element, options?) {
  return new LineUpView(context, selection, parent, options);
}
