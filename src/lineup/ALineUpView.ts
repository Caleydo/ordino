/**
 * Created by sam on 13.02.2017.
 */
import {AView, EViewMode, IViewContext, ISelection, ViewWrapper} from '../View';
import LineUp, {ILineUpConfig} from 'lineupjs/src/lineup';
import {deriveColors} from 'lineupjs/src/';
import {createStackDesc, ScaleMappingFunction} from 'lineupjs/src/model';
import {LocalDataProvider, } from 'lineupjs/src/provider';
import * as d3 from 'd3';
import {ITable} from 'phovea_core/src/table';
import {list as rlist, Range} from 'phovea_core/src/range';
import {IDType} from 'phovea_core/src/idtype';
import {IPlugin, list as listPlugins} from 'phovea_core/src/plugin';
import {generateDialog} from 'phovea_ui/src/dialogs';
import * as cmds from './cmds';
import {saveNamedSet} from '../storage';
import {showErrorModalDialog} from '../Dialogs';
import {deriveCol} from './desc';
import IScore, {IScoreRow} from './IScore';
/**
 * @deprecated Use ALineUpView2 instead
 */
export default class ALineUpView extends AView {
  private config: ILineUpConfig = {
    renderingOptions: {
      histograms: true
    },
    header: {
      rankingButtons: this.lineupRankingButtons.bind(this)
    },
    body: {}
  };

  protected $nodata;
  private $params: d3.Selection<ViewWrapper>;

  protected lineup: any;

  private idType: IDType;
  private selectionHelper = {
    id2index: d3.map<number>(),
    index2id: d3.map<number>(),
    rows: [],
    idAccessor: (x) => x,
    id2UnderscoreId: d3.map<number>(), // key: id (e.g., Ensembl), value: _id (Caleydo Mapping Id from Redis DB)
    underscoreIdAccessor: (id: string) => this.selectionHelper.id2UnderscoreId.get(id) // returns the _id for a `id`
  };
  private scoreAccessor = (row: any, id: string, desc: any) => {
    const rowId = this.selectionHelper.idAccessor(row);
    return (desc.scores && typeof desc.scores[rowId] !== 'undefined') ? desc.scores[rowId] : (typeof desc.missingValue !== 'undefined' ? desc.missingValue : null);
  }

  private dump: any = null;

  resolver: (d: any) => void;

  private orderedSelectionIndicies: number[] = [];

  constructor(context: IViewContext, parent: Element, private options?) {
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

  private lineupRankingButtons($node: d3.Selection<any>) {
    $node.append('button').attr('class', 'fa fa-download').on('click', (ranking) => {
      this.lineup.data.exportTable(ranking, {separator: ';', quote: true}).then((content) => {
        const downloadLink = document.createElement('a');
        const blob = new Blob([content], {type: 'text/csv;charset=utf-8'});
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
    columns.push(createStackDesc());
    $ul.selectAll('li.col').data(columns)
      .enter()
      .append('li').classed('col', true)
      .append('a').attr('href', '#').text((d: any) => d.label)
      .on('click', (d) => {
        const ranking = this.lineup.data.getLastRanking();
        this.lineup.data.push(ranking, d);
        (<Event>d3.event).preventDefault();
      });

    $ul.append('li').classed('divider', true);

    const scores = listPlugins('targidScore').filter((d: any) => d.idtype === this.idType.id);
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

  protected buildLineUpFromTable(table: ITable, filteredIds = []) {
    const columns = table.cols().map(deriveCol);
    deriveColors(columns);
    return Promise.all([<any>table.objects(), table.rowIds()]).then((args: any) => {
      const rows: any[] = args[0];
      const rowIds: Range = args[1];

      const storage = new LocalDataProvider(rows, columns);
      this.idType = table.idtypes[0];
      this.lineup = new LineUp(this.node, storage, this.config);
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

  protected replaceLineUpDataFromTable(table: ITable) {
    return Promise.all([<any>table.objects(), table.rowIds()]).then((args: any) => {
      const rows: any[] = args[0];
      const rowIds: Range = args[1];
      this.lineup.data.setData(rows);
      this.updateSelection(rowIds.dim(0).asList());
      return this.lineup;
    });
  }

  protected buildLineUp(rows: any[], columns: any[], idtype: IDType, idAccessor: (row: any) => number) {
    deriveColors(columns);
    const storage = new LocalDataProvider(rows, columns);
    this.idType = idtype;
    this.lineup = new LineUp(this.node, storage, this.config);

    //this.lineup.update();

    if (idAccessor) {
      this.initSelection(rows, idAccessor, idtype);
    }

    rows.forEach((r) => {
      this.selectionHelper.id2UnderscoreId.set(r.id, r._id);
    });

    return this.lineup;
  }

  protected initializedLineUp() {
    this.updateRef(this.lineup.data);
    cmds.clueify(this.context.ref, this.context.graph);
    this.updateLineUpStats();
  }

  protected withoutTracking(f: (lineup: any)=>void) {
    cmds.untrack(this.context.ref).then(f.bind(this, this.lineup)).then(cmds.clueify.bind(cmds, this.context.ref, this.context.graph));
  }

  protected replaceLineUpData(rows: any[]) {
    if (rows.length === 0) {
      console.warn('rows.length ===', rows.length, '--> LineUp does not support empty data and might throw errors');
    }
    this.lineup.data.setData(rows);
    this.updateSelection(rows);
    return this.lineup;
  }

  protected updateMapping(column: string, rows: any[]) {
    //TODO this is the reason for the 'reset' bug, we are setting a mapping manually
    const col = this.lineup.data.find((d) => d.desc.type === 'number' && d.desc.column === column);
    if (col) {
      col.setMapping(new ScaleMappingFunction(d3.extent(rows, (d) => d[column])));
    }
  }


  private initSelection(rows: any[], idAccessor: (row: any) => number, idType: IDType) {
    this.idType = idType;

    this.selectionHelper.idAccessor = idAccessor;
    this.selectionHelper.rows = rows;

    this.lineup.on('multiSelectionChanged', this.onChange);

    //create lookup cache
    rows.forEach((row, i) => {
      this.selectionHelper.id2index.set(String(idAccessor(row)), i);
      this.selectionHelper.index2id.set(String(i), idAccessor(row));
    });

    this.updateLineUpStats();
  }

  private onChange = (indices) => {
    // compute the difference
    const diffAdded = this.array_diff(indices, this.orderedSelectionIndicies);
    const diffRemoved = this.array_diff(this.orderedSelectionIndicies, indices);

    // add new element to the end
    if (diffAdded.length > 0) {
      diffAdded.forEach((d) => {
        this.orderedSelectionIndicies.push(d);
      });
    }

    // remove elements within, but preserve order
    if (diffRemoved.length > 0) {
      diffRemoved.forEach((d) => {
        this.orderedSelectionIndicies.splice(this.orderedSelectionIndicies.indexOf(d), 1);
      });
    }

    const ids = rlist(this.orderedSelectionIndicies.map((i) => this.selectionHelper.idAccessor(this.selectionHelper.rows[i])));
    //console.log(this.orderedSelectionIndicies, ids.toString(), diffAdded, diffRemoved);

    this.setItemSelection({idtype: this.idType, range: ids});
  }

  /**
   * Returns the all items that are not in the given two arrays
   * TODO improve performance of diff algorithm
   * @param array1
   * @param array2
   * @returns {any}
   */
  private array_diff(array1, array2) {
    return array1.filter(function (elm) {
      return array2.indexOf(elm) === -1;
    });
  }

  setItemSelection(sel: ISelection) {
    if (this.lineup) {
      const indices: number[] = [];
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

  private updateSelection(rows: any[]) {
    this.selectionHelper.id2index = d3.map<number>();
    this.selectionHelper.index2id = d3.map<number>();
    this.selectionHelper.rows = rows;
    //create lookup cache
    rows.forEach((row, i) => {
      this.selectionHelper.id2index.set(String(this.selectionHelper.idAccessor(row)), i);
      this.selectionHelper.index2id.set(String(i), this.selectionHelper.idAccessor(row));
    });
  }

  pushScore(scorePlugin: IPlugin, ranking = this.lineup.data.getLastRanking()) {
    //TODO clueify
    Promise.resolve(scorePlugin.factory(scorePlugin.desc)) // open modal dialog
      .then((scoreImpl) => { // modal dialog is closed and score created
        this.startScoreComputation(scoreImpl, scorePlugin, ranking);
      });
  }

  /**
   *
   * @param scoreImpl
   * @param scorePlugin
   * @param ranking
   */
  protected startScoreComputation(scoreImpl: IScore<any>, scorePlugin: IPlugin, ranking = this.lineup.data.getLastRanking()) {
    const that = this;

    const colors = d3.scale.category10().range().slice();
    // remove colors that are already in use from the list
    ranking.flatColumns.forEach((d) => {
      const i = colors.indexOf(d.color);
      if (i > -1) {
        colors.splice(i, 1);
      }
    });

    const desc = scoreImpl.createDesc();
    desc.color = colors.shift(); // get and remove color from list
    desc._score = scorePlugin;
    desc.accessor = this.scoreAccessor;
    this.lineup.data.pushDesc(desc);
    const col = this.lineup.data.push(ranking, desc);

    let timerId = 0;

    if (desc.type === 'number') {
      // get current row order make a copy to reverse it -> will animate the sinus curve in the opposite direction
      const order = ranking.getOrder().slice(0).reverse();
      const sinus = Array.apply(null, Array(20)) // create 20 fields
        .map((d, i) => i * 0.1) // [0, 0.1, 0.2, ...]
        .map((v) => Math.sin(v * Math.PI)); // convert to sinus

      // set column mapping to sinus domain = [-1, 1]
      col.setMapping(new ScaleMappingFunction(d3.extent(<number[]>sinus)));

      let numAnimationCycle = 0;
      let rowId = 0;

      const animateBars = function () {
        const scores = {}; // must be an object!
        order.forEach((rowIndex, index) => {
          rowId = that.selectionHelper.index2id.get(rowIndex);
          scores[rowId] = sinus[(index + numAnimationCycle) % sinus.length];
        });
        desc.scores = scores;
        that.lineup.update();

        // on next animation jump by 5 items
        numAnimationCycle += 5;

        // replay animation
        clearTimeout(timerId);
        timerId = window.setTimeout(function () {
          animateBars();
        }, 1000);
      };

      animateBars(); // start animation
    }

    scoreImpl.compute([], this.idType)
    // convert to score array to object to use in LineUp
      .then((rows: IScoreRow<any>[]) => {
        const r: { [id: string]: number } = {};
        rows.forEach((row) => {
          r[this.selectionHelper.underscoreIdAccessor(row.id)] = row.score;
        });
        return r;
      })
      .then((scores) => {
        clearTimeout(timerId); // stop animation
        desc.scores = scores;
        if (desc.type === 'number') {
          if (!(desc.constantDomain)) {
            desc.domain = d3.extent(<number[]>(d3.values(scores)));
          }
          col.setMapping(new ScaleMappingFunction(desc.domain));
        }
        this.lineup.update();
      })
      .catch(showErrorModalDialog)
      .catch((xhr) => {
        ranking.remove(col);
      });
  }

  saveRanking(order: number[]) {
    const r = this.selectionHelper.rows;
    const acc = this.selectionHelper.idAccessor;
    const ids = rlist(order.map((i) => acc(r[i])).sort(d3.ascending));
    const dialog = generateDialog('Save Named Set');
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
      saveNamedSet(name, this.idType, ids, this.getSubType(), description).then((d) => {
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
   * Get sub type for named sets
   * @returns {{key: string, value: string}}
   */
  protected getSubType() {
    return {
      key: '',
      value: ''
    };
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
      let str = 'Showing ';

      str += `${shown} `;
      if (total !== 0) {
        str += `of ${total} `;
      }
      str += this.getItemName(total);
      if (selected > 0) {
        str += `; ${selected} selected`;
      }
      return str;
    };

    let selected = 0;
    let total = 0;

    // this.lineup not available
    if (!this.lineup) {
      this.$params.html(showStats(total, selected));
      return;
    }

    selected = this.lineup.data.getSelection().length;
    total = this.lineup.data.data.length;

    const r = this.lineup.data.getRankings()[0];
    if (r) {
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

  getItemName(count: number): string {
    return (count === 1) ? 'item' : 'items';
  }

  /**
   * Destroy LineUp instance
   */
  destroyLineUp() {
    if (this.lineup) {
      this.lineup.destroy();
    }
  }

  // destroy targid view
  destroy() {
    if (this.lineup) {
      this.lineup.on('updateStart', null);
      this.lineup.on('updateFinished', null);
    }
  }

  modeChanged(mode: EViewMode) {
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

  /**
   * Fill the idType map cache
   * The goal is to avoid further mapping request from the id resolver to the server
   * @param idtype
   * @param rows
   */
  fillIDTypeMapCache(idtype: IDType, rows: {_id: number, id: string}[]) {
    const ids = [], names = [];
    rows.forEach((r, i) => {
      ids[i] = r._id;
      names[i] = r.id;
    });
    idtype.fillMapCache(ids, names);
  }
}