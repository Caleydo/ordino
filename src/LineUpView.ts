/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
import {AView, EViewMode, IViewContext, ISelection, ViewWrapper, IAViewOptions} from './View';
import LineUp from 'lineupjs/src/lineup';
import {deriveColors} from 'lineupjs/src/';
import {createStackDesc, ScaleMappingFunction, createSelectionDesc} from 'lineupjs/src/model';
import {LocalDataProvider} from 'lineupjs/src/provider';
import * as d3 from 'd3';
import * as idtypes from 'phovea_core/src/idtype';
import * as tables from 'phovea_core/src/table';
import * as ranges from 'phovea_core/src/range';
import * as plugins from 'phovea_core/src/plugin';
import * as dialogs from 'phovea_ui/src/dialogs';
import * as cmds from './LineUpCommands';
import {saveNamedSet} from './storage';
import {showErrorModalDialog} from './Dialogs';
import {IDType} from 'phovea_core/src/idtype';
import {EventHandler} from 'phovea_core/src/event';

export function numberCol(col:string, rows:any[], label = col, visible = true, width = -1, selectedId = -1) {
  return {
    type: 'number',
    column: col,
    label: label,
    domain: d3.extent(rows, (d) => d[col]),
    color: '',
    visible: visible,
    width: width,
    selectedId: selectedId
  };
}

export function numberCol2(col:string, min:number, max:number, label = col, visible = true, width = -1, selectedId = -1) {
  return {
    type: 'number',
    column: col,
    label: label,
    domain: [min, max],
    color: '',
    visible: visible,
    width: width,
    selectedId: selectedId
  };
}


export function categoricalCol(col:string, categories:(string|{label?: string, name: string, color?: string})[], label = col, visible = true, width = -1, selectedId = -1) {
  return {
    type: 'categorical',
    column: col,
    label: label,
    categories: categories,
    color: '',
    visible: visible,
    width: width,
    selectedId: selectedId
  };
}


export function stringCol(col:string, label = col, visible = true, width = -1, selectedId = -1) {
  return {
    type: 'string',
    column: col,
    label: label,
    color: '',
    visible: visible,
    width: width,
    selectedId: selectedId
  };
}

export function booleanCol(col:string, label = col, visible = true, width = -1, selectedId = -1) {
  return {
    type: 'boolean',
    column: col,
    label: label,
    color: '',
    visible: visible,
    width: width,
    selectedId: selectedId
  };
}

/**
 * Returns the all items that are not in the given two arrays
 * TODO improve performance of diff algorithm
 * @param array1
 * @param array2
 * @returns {any}
 */
function array_diff(array1, array2) {
  return array1.filter((elm) => array2.indexOf(elm) === -1);
}


export function useDefaultLayout(instance:any) {
  instance.data.deriveDefault();
  //insert selection column
  instance.data.insert(instance.data.getRankings()[0], 1, createSelectionDesc());
}

export function deriveCol(col:tables.IVector) {
  let r:any = {
    column: col.desc.name
  };
  const desc = <any>col.desc;
  if (desc.color) {
    r.color = desc.color;
  } else if (desc.cssClass) {
    r.cssClass = desc.cssClass;
  }
  let val = desc.value;
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


export abstract class ALineUpView2 extends AView {

  resolver:(d:any) => void;

  protected lineup:any;

  protected additionalScoreParameter: any = null;

  private initLineUpPromise;

  private config = {
    renderingOptions: {
      histograms: true
    },
    header: {
      rankingButtons: ($node:d3.Selection<any>) => {
        const rb = new LineUpRankingButtons(this.lineup, $node, this.idType, this.additionalScoreParameter);
        rb.on(LineUpRankingButtons.SAVE_NAMED_SET, (event, order, name, description) => {
          this.saveNamedSet(order, name, description);
        });
        rb.on(LineUpRankingButtons.ADD_SCORE_COLUMN, (event, scoreImpl, scorePlugin) => {
          this.addScoreColumn(scoreImpl, scorePlugin);
        });
        return rb;
      }
    },
    body: {}
  };

  protected idType:idtypes.IDType;

  /**
   * Stores the ranking data when collapsing columns on modeChange()
   * @type {any}
   */
  private dump:any = null;

  /**
   * DOM element with message when no data is available
   */
  protected $nodata;

  /**
   * DOM element for LineUp stats in parameter UI
   */
  private $params:d3.Selection<ViewWrapper>;

  private selectionHelper:LineUpSelectionHelper;

  protected idAccessor = (d) => d._id;

  private scoreAccessor = (row:any, index:number, id:string, desc:any) => {
    const row_id = this.idAccessor(row);
    let r = (desc.scores && typeof desc.scores[row_id] !== 'undefined') ? desc.scores[row_id] : (typeof desc.missingValue !== 'undefined' ? desc.missingValue : null);
    if (desc.type === 'categorical') {
      r = String(r); //even null values
    }
    return r;
  };

  constructor(context:IViewContext, protected selection: ISelection, parent:Element, private options?: IAViewOptions) {
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

  init() {
    super.init();
    //this.build(); // will be called from update()
    this.update();
  }

  private initSelectionHelper() {
    this.selectionHelper = new LineUpSelectionHelper(this.lineup, this.idType, this.idAccessor);
    this.selectionHelper.on(LineUpSelectionHelper.SET_ITEM_SELECTION, (event, selection) => {
      this.setItemSelection(selection);
    });
    this.selectionHelper.init();
    this.updateLineUpStats();
  }

  changeSelection(selection:ISelection) {
    super.changeSelection(selection);
    this.selection = selection;
    this.handleSelectionColumns(this.selection);
  }

  setItemSelection(selection:ISelection) {
    this.selectionHelper.setItemSelection(selection);
    this.updateLineUpStats();
    super.setItemSelection(selection);
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    super.buildParameterUI($parent, onChange);

    // used for LineUp stats
    this.$params = $parent.append('div')
      .classed('form-group', true)
      .append('p');
  }

  getParameter(name: string):any {
    return super.getParameter(name);
  }

  setParameter(name: string, value: any) {
    return super.setParameter(name, value);
  }

  /**
   * Expand/collapse certain columns on mode change.
   * Expand = focus view
   * Collapse = context view
   * @param mode
   */
  modeChanged(mode:EViewMode) {
    super.modeChanged(mode);
    if (!this.lineup) {
      return;
    }

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

  private saveNamedSet(order, name, description) {
    const r = this.selectionHelper.rows;
    const ids = ranges.list(order.map((i) => this.idAccessor(r[i])).sort(d3.ascending));
    saveNamedSet(name, this.idType, ids, this.getSubType(), description).then((d) => {
      console.log('saved', d);
      this.fire(AView.EVENT_UPDATE_ENTRY_POINT, this.idType, d);
    });
  }

  protected handleSelectionColumns(selection) {
    this.initLineUpPromise.then(() => {
      this.handleSelectionColumnsImpl(selection);
    });
  }

  protected handleSelectionColumnsImpl(selection) {
    const selectedIds = selection.range.dim(0).asList();

    const ranking = this.lineup.data.getLastRanking();
    const usedCols = ranking.flatColumns.filter((d) => d.desc.selectedId !== -1);
    const lineupColIds = usedCols
      .map((d) => d.desc.selectedId)
      .filter((d) => d !== undefined);

    // compute the difference
    const diffAdded = array_diff(selectedIds, lineupColIds);
    const diffRemoved = array_diff(lineupColIds, selectedIds);

    // add new columns to the end
    if(diffAdded.length > 0) {
      //console.log('add columns', diffAdded);
      diffAdded.forEach((id) => {
        this.getSelectionColumnDesc(id)
          .then((columnDesc) => {
            this.withoutTracking(() => {
              this.addColumn(columnDesc, this.loadSelectionColumnData.bind(this), id, true); // true == withoutTracking
            });
          });
      });
    }

    // remove deselected columns
    if(diffRemoved.length > 0) {
      this.withoutTracking(() => {
        //console.log('remove columns', diffRemoved);
        diffRemoved.forEach((id) => {
          let col = usedCols.filter((d) => d.desc.selectedId === id)[0];
          ranking.remove(col);
        });
      });
    }
  }

  protected getSelectionColumnId(id) {
    // hook
    return `col_${id}`;
  }

  protected getSelectionColumnLabel(id) {
    // hook
    return new Promise((resolve) => {
      const label = `Selection ${id}`;
      resolve(label);
    });
  }

  protected getSelectionColumnDesc(id) {
    return this.getSelectionColumnLabel(id)
      .then((label:string) => {
        return stringCol(this.getSelectionColumnId(id), label, true, 50, id);
      });
  }

  protected addColumn(colDesc, loadColumnData: (id) => Promise<IScoreRow<any>[]>, id = -1, withoutTracking = false) {
    const ranking = this.lineup.data.getLastRanking();
    const colors = this.getAvailableColumnColors(ranking);

    colDesc.color = colors.shift(); // get and remove color from list
    colDesc.accessor = this.scoreAccessor;
    this.lineup.data.pushDesc(colDesc);
    const col = this.lineup.data.push(ranking, colDesc);

    const intervalId = this.addColumnLoadAnimation(col, colDesc, ranking);

    const loadPromise = loadColumnData(id);

    // error handling
    loadPromise
      .catch(showErrorModalDialog)
      .catch(() => {
        clearTimeout(intervalId); // stop animation
        ranking.remove(col);
      });

    // success
    loadPromise
      // map selection rows
      .then((rows: IScoreRow<any>[]) => {
        if(id !== -1) {
          return this.mapSelectionRows(rows);
        }
        return rows;
      })
      // convert to score array to object to use in LineUp
      .then((rows: IScoreRow<any>[]) => {
        const r:{ [id:string]:number } = {};
        rows.forEach((row) => {
          r[this.selectionHelper.underscoreIdAccessor(row.id)] = row.score;
        });
        return r;
      })
      .then((scores:{ [id:string]:number }) => {
        clearTimeout(intervalId); // stop animation
        colDesc.scores = scores;
        if (colDesc.type === 'number') {
          if (!(colDesc.constantDomain)) { //create a dynamic range if not fixed
            colDesc.domain = d3.extent(<number[]>(d3.values(scores)));
          }
          // add selection columns wihtout tracking changes
          if(withoutTracking) {
            this.withoutTracking(() => {
              col.setMapping(new ScaleMappingFunction(colDesc.domain));
            });
          // however, track changes in score columns
          } else {
            col.setMapping(new ScaleMappingFunction(colDesc.domain));
          }
        }
        this.lineup.update();
      });

    return col;
  }

  protected mapSelectionRows(rows:IScoreRow<any>[]) {
    // hook
    return rows;
  }

  protected getAvailableColumnColors(ranking = this.lineup.data.getLastRanking()) {
    const colors = d3.scale.category10().range().slice();
    // remove colors that are already in use from the list
    ranking.flatColumns.forEach((d) => {
      const i = colors.indexOf(d.color);
      if(i > -1) {
        colors.splice(i, 1);
      }
    });
    return colors;
  }

  protected addColumnLoadAnimation(column, columnDesc, ranking) {
    const that = this;

    if(columnDesc.type !== 'number') {
      return 0;
    }

    const sinus = Array.apply(null, Array(20)) // create 20 fields
      .map((d, i) => i*0.1) // [0, 0.1, 0.2, ...]
      .map(v => Math.sin(v*Math.PI)); // convert to sinus

    // avoid tracking
    this.withoutTracking(() => {
      // set column mapping to sinus domain = [-1, 1]
      column.setMapping(new ScaleMappingFunction(d3.extent(<number[]>sinus)));
    });

    const order = ranking.getOrder();
    let numAnimationCycle = 0;

    const animateBars = function() {
      const scores = {}; // must be an object!
      // retrieve only the visible rows
      const range = that.lineup.slice(0, order.length, (i) => i * that.lineup.config.body.rowHeight);
      order
        .slice(range.from, range.to) // copy only visible rows
        .reverse() // reverse will animate the sinus curve in the opposite direction
        .forEach((rowIndex, index) => {
          let rowId = that.selectionHelper.index2id.get(rowIndex);
          scores[rowId] = sinus[(index + range.from + numAnimationCycle) % sinus.length];
        });

      columnDesc.scores = scores;
      that.lineup.update();

      // on next animation jump by 5 items
      numAnimationCycle += 5;
    };

    animateBars(); // start animation

    return window.setInterval(animateBars, 1000);
  }

  protected loadSelectionColumnData(id): Promise<IScoreRow<any>[]> {
    // hook
    return Promise.resolve([]);
  }

  /**
   *
   * @param scoreImpl
   * @param scorePlugin
   */
  protected addScoreColumn(scoreImpl:IScore<any>, scorePlugin:plugins.IPlugin) {
    const colDesc = scoreImpl.createDesc();
    colDesc._score = scorePlugin;

    const loadScoreColumn = (id) => {
      return scoreImpl.compute([], this.idType);
    };

    this.addColumn(colDesc, loadScoreColumn);
  }

  destroy() {
    if(this.lineup) {
      this.lineup.on('updateStart', null);
      this.lineup.on('updateFinished', null);
    }
    super.destroy();
  }

  protected build(rows:any[] = [], columns:any[] = []) {
    // prevent re-initialization
    if(this.lineup) {
      return;
    }

    deriveColors(columns);

    const storage = new LocalDataProvider(rows, columns);
    this.lineup = new LineUp(this.node, storage, this.config);
    this.initSelectionHelper();

    //this.lineup.on('updateStart', () => { this.setBusy(true); });
    //this.lineup.on('updateFinished', () => { this.setBusy(false); });

    const ranking = this.lineup.data.pushRanking();

    columns.forEach((d,i) => {
      // add visible columns
      if(d.visible) {
        this.lineup.data.push(ranking, d);
      }

      // set initial column width
      if(d.width > -1) {
        ranking.columns[i+1].setWidth(d.width); // i+1 because first column == rank
      }
    });

    // add selection column
    useDefaultLayout(this.lineup);
    this.lineup.update();
  }

  protected update() {
    this.setBusy(true);

    this.initLineUpPromise = this.loadColumnDesc()
      .then((desc:{idType:string, columns:any[]}) => {
        this.initColumns(desc);
        return this.loadRows();
      })
      .then((rows:any[]) => {
        this.initRows(rows);
      })
      .then(() => {
        this.initializedLineUp();
        this.setBusy(false);
      })
      .catch(() => {
        this.setBusy(false);
      });
  }

  protected loadColumnDesc() {
    // hook
    return new Promise((resolve) => {
      const r = {
        idType: '',
        columns: []
      };
      resolve(r);
    });
  }

  protected initColumns(desc) {
    this.idType = idtypes.resolve(desc.idType);
  }

  protected loadRows() {
    return new Promise((resolve, reject) => {
      const r = [];
      resolve(r);
    });
  }

  protected initRows(rows:any[]) {
    this.$nodata.classed('hidden', (rows.length > 0));
    // no data available
    if(rows.length === 0) {
      return [];
    }

    rows = this.mapRows(rows);

    this.fillIDTypeMapCache(this.idType, rows);
    this.lineup.data.setData(rows);
    this.selectionHelper.rows = rows;
    return rows;
  }

  protected mapRows(rows:any[]) {
    // hook
    return rows;
  }

  private updateRef(storage) {
    if (this.resolver) {
      this.resolver(storage);
      this.resolver = null;
    }
    this.context.ref.value.data = Promise.resolve(storage);
  }

  protected initializedLineUp() {
    this.updateRef(this.lineup.data);
    cmds.clueify(this.context.ref, this.context.graph);
    this.updateLineUpStats();
  }

  protected withoutTracking(f: (lineup: any)=>void) {
    cmds.untrack(this.context.ref)
      .then(f.bind(this, this.lineup))
      .then(cmds.clueify.bind(cmds, this.context.ref, this.context.graph));
  }

  /**
   * Fill the idType map cache
   * The goal is to avoid further mapping request from the id resolver to the server
   * @param idtype
   * @param rows
   */
  protected fillIDTypeMapCache(idtype:IDType, rows:{_id:number, id:string}[]) {
    var ids = [], names = [];
    rows.forEach((r, i) => {
      ids[i] = r._id;
      names[i] = r.id;
    });
    idtype.fillMapCache(ids, names);
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

      str += `${shown} `;
      if (total !== 0) {
        str += `of ${total} `;
      }
      str += this.getItemName(total);
      if(selected > 0) {
        str += `; ${selected} selected`;
      }
      return str;
    };

    var selected = 0;
    var total = 0;

    // this.lineup not available
    if(!this.lineup) {
      this.$params.html(showStats(total, selected));
      return;
    }

    selected = this.lineup.data.getSelection().length;
    total = this.lineup.data.data.length;

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

  protected getItemName(count: number) {
    return (count === 1) ? 'item' : 'items';
  }

  /**
   * Destroy LineUp instance
   */
  protected clear() {
    if(this.lineup) {
      this.lineup.destroy();
      this.lineup = undefined; // delete ref to call this.build() again

      this.selectionHelper.destroy();
      this.selectionHelper = undefined;
    }
  }

}

class LineUpRankingButtons extends EventHandler {

  public static SAVE_NAMED_SET = 'saveNamedSet';
  public static ADD_SCORE_COLUMN = 'addScoreColumn';

  constructor(private lineup, private $node:d3.Selection<any>, private idType:IDType, private extraArgs:any) {
    super();

    this.appendDownload();
    this.appendSaveRanking();
    this.appendMoreColumns();
  }

  private appendDownload() {
    this.$node.append('button')
      .attr('class', 'fa fa-download')
      .on('click', (ranking) => {
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
  }

  private appendSaveRanking() {
    this.$node.append('button')
      .attr('class', 'fa fa-save')
      .on('click', (ranking) => {
        this.saveRankingDialog(ranking.getOrder());
      });
  }

  private saveRankingDialog(order:number[]) {
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

      this.fire(LineUpRankingButtons.SAVE_NAMED_SET, order, name, description);

      dialog.hide();
      return false;
    };

    dialog.footer.innerHTML = `<button type="submit" form="namedset_form" class="btn btn-default btn-primary">Save</button>`;

    dialog.onHide(() => {
      dialog.destroy();
    });

    dialog.show();
  }

  private appendMoreColumns() {
    const $div = this.$node.append('div');

    $div.append('button')
      .attr('class', 'fa fa-plus dropdown-toggle')
      .attr('data-toggle', 'dropdown');

    const $ul = $div.append('ul').attr('class', 'dropdown-menu');

    const columns = this.lineup.data.getColumns().filter((d) => !d._score);
    columns.push(createStackDesc());
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
          this.scoreColumnDialog(p);
        });
        (<Event>d3.event).preventDefault();
      });
  }

  private scoreColumnDialog(scorePlugin:plugins.IPlugin) {
    //TODO clueify
    // pass dataSource into InvertedAggregatedScore factory method
    Promise.resolve(scorePlugin.factory(scorePlugin.desc, this.extraArgs)) // open modal dialog
      .then((scoreImpl) => { // modal dialog is closed and score created
        this.fire(LineUpRankingButtons.ADD_SCORE_COLUMN, scoreImpl, scorePlugin);
      });
  }
}

class LineUpSelectionHelper extends EventHandler {

  public static SET_ITEM_SELECTION = 'setItemSelection';

  private _rows: any[] = [];

  private orderedSelectionIndicies:number[] = [];

  private id2index = d3.map<number>();
  public index2id = d3.map<number>();

  // key: id (e.g., Ensembl), value: _id (Caleydo Mapping Id from Redis DB)
  private id2UnderscoreId = d3.map<number>();

  // Returns the _id for a given `id`
  public underscoreIdAccessor = (id:string) => this.id2UnderscoreId.get(id);

  constructor(private lineup, private idType:IDType, private idAccessor) {
    super();
  }

  init() {
    this.buildCache();
    this.addEventListener();
  }

  private buildCache() {
    // create lookup cache
    this._rows.forEach((row, i) => {
      this.id2index.set(String(this.idAccessor(row)), i);
      this.index2id.set(String(i), this.idAccessor(row));
      this.id2UnderscoreId.set(row.id, row._id);
    });
  }

  private addEventListener() {
    this.lineup.on('multiSelectionChanged', (data_indices) => {
      this.onMultiSelectionChanged(data_indices);
    });
  }

  private removeEventListener() {
    this.lineup.on('multiSelectionChanged', null);
  }

  private onMultiSelectionChanged(data_indices) {
    // compute the difference
    const diffAdded = array_diff(data_indices, this.orderedSelectionIndicies);
    const diffRemoved = array_diff(this.orderedSelectionIndicies, data_indices);

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

    const ids = ranges.list(this.orderedSelectionIndicies.map((i) => this.idAccessor(this._rows[i])));
    //console.log(this.orderedSelectionIndicies, ids.toString(), diffAdded, diffRemoved);

    const selection:ISelection = {idtype: this.idType, range: ids};
    // Note: listener of that event calls LineUpSelectionHelper.setItemSelection()
    this.fire(LineUpSelectionHelper.SET_ITEM_SELECTION, selection);
  }

  set rows(rows:any[]) {
    this._rows = rows;
    this.buildCache();
  }

  get rows():any[] {
    return this._rows;
  }

  setItemSelection(sel:ISelection) {
    if (!this.lineup) {
      return;
    }

    var indices:number[] = [];
    sel.range.dim(0).forEach((id) => {
      const index = this.id2index.get(String(id));
      if (typeof index === 'number') {
        indices.push(index);
      }
    });

    this.removeEventListener();
    this.lineup.data.setSelection(indices);
    this.addEventListener();
  }

  destroy() {
    this.removeEventListener();
  }

}

/**
 * @deprecated Use ALineUpView2 instead
 */
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
    index2id: d3.map<number>(),
    rows: [],
    idAccessor: (x) => x,
    id2UnderscoreId: d3.map<number>(), // key: id (e.g., Ensembl), value: _id (Caleydo Mapping Id from Redis DB)
    underscoreIdAccessor: (id:string) => this.selectionHelper.id2UnderscoreId.get(id) // returns the _id for a `id`
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
    columns.push(createStackDesc());
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

  protected buildLineUpFromTable(table:tables.ITable, filteredIds = []) {
    const columns = table.cols().map(deriveCol);
    deriveColors(columns);
    return Promise.all([<any>table.objects(), table.rowIds()]).then((args:any) => {
      var rows:any[] = args[0];
      const rowIds:ranges.Range = args[1];

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

  protected replaceLineUpData(rows:any[]) {
    if(rows.length === 0) {
      console.warn('rows.length ===', rows.length, '--> LineUp does not support empty data and might throw errors');
    }
    this.lineup.data.setData(rows);
    this.updateSelection(rows);
    return this.lineup;
  }

  protected updateMapping(column:string, rows:any[]) {
    //TODO this is the reason for the 'reset' bug, we are setting a mapping manually
    const col = this.lineup.data.find((d) => d.desc.type === 'number' && d.desc.column === column);
    if (col) {
      col.setMapping(new ScaleMappingFunction(d3.extent(rows, (d) => d[column])));
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
      this.selectionHelper.index2id.set(String(i), idAccessor(row));
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
    this.selectionHelper.index2id = d3.map<number>();
    this.selectionHelper.rows = rows;
    //create lookup cache
    rows.forEach((row, i) => {
      this.selectionHelper.id2index.set(String(this.selectionHelper.idAccessor(row)), i);
      this.selectionHelper.index2id.set(String(i), this.selectionHelper.idAccessor(row));
    });
  }

  pushScore(scorePlugin:plugins.IPlugin, ranking = this.lineup.data.getLastRanking()) {
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
  protected startScoreComputation(scoreImpl:IScore<number>, scorePlugin:plugins.IPlugin, ranking = this.lineup.data.getLastRanking()) {
    const that = this;

    const colors = d3.scale.category10().range().slice();
    // remove colors that are already in use from the list
    ranking.flatColumns.forEach((d) => {
      const i = colors.indexOf(d.color);
      if(i > -1) {
        colors.splice(i, 1);
      }
    });

    const desc = scoreImpl.createDesc();
    desc.color = colors.shift(); // get and remove color from list
    desc._score = scorePlugin;
    desc.accessor = this.scoreAccessor;
    this.lineup.data.pushDesc(desc);
    const col = this.lineup.data.push(ranking, desc);

    if(desc.type === 'number') {
      // get current row order make a copy to reverse it -> will animate the sinus curve in the opposite direction
      const order = ranking.getOrder().slice(0).reverse();
      const sinus = Array.apply(null, Array(20)) // create 20 fields
        .map((d, i) => i*0.1) // [0, 0.1, 0.2, ...]
        .map(v => Math.sin(v*Math.PI)); // convert to sinus

      // set column mapping to sinus domain = [-1, 1]
      col.setMapping(new ScaleMappingFunction(d3.extent(<number[]>sinus)));

      var timerId = 0;
      var numAnimationCycle = 0;
      var rowId = 0;

      const animateBars = function() {
        const scores = {}; // must be an object!
        order.forEach((rowIndex, index) => {
          rowId = that.selectionHelper.index2id.get(rowIndex);
          scores[rowId] = sinus[(index+numAnimationCycle) % sinus.length];
        });
        desc.scores = scores;
        that.lineup.update();

        // on next animation jump by 5 items
        numAnimationCycle += 5;

        // replay animation
        clearTimeout(timerId);
        timerId = window.setTimeout(function() { animateBars(); }, 1000);
      };

      animateBars(); // start animation
    }

    scoreImpl.compute([], this.idType)
      // convert to score array to object to use in LineUp
      .then((rows: IScoreRow<any>[]) => {
        const r:{ [id:string]:number } = {};
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
      var str = 'Showing ';

      str += `${shown} `;
      if (total !== 0) {
        str += `of ${total} `;
      }
      str += this.getItemName(total);
      if(selected > 0) {
        str += `; ${selected} selected`;
      }
      return str;
    };

    var selected = 0;
    var total = 0;

    // this.lineup not available
    if(!this.lineup) {
      this.$params.html(showStats(total, selected));
      return;
    }

    selected = this.lineup.data.getSelection().length;
    total = this.lineup.data.data.length;

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

  /**
   * Destroy LineUp instance
   */
  destroyLineUp() {
    if(this.lineup) {
      this.lineup.destroy();
    }
  }

  // destroy targid view
  destroy() {
    if(this.lineup) {
      this.lineup.on('updateStart', null);
      this.lineup.on('updateFinished', null);
    }
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

  /**
   * Fill the idType map cache
   * The goal is to avoid further mapping request from the id resolver to the server
   * @param idtype
   * @param rows
   */
  fillIDTypeMapCache(idtype:IDType, rows:{_id:number, id:string}[]) {
    var ids = [], names = [];
    rows.forEach((r, i) => {
      ids[i] = r._id;
      names[i] = r.id;
    });
    idtype.fillMapCache(ids, names);
  }
}

export interface IScoreRow<T> {
  id: string;
  score: T;
}

export interface IScore<T> {
  createDesc():any;
  /**
   * Start the computation of the score for the given ids
   * @param ids
   * @param idtype
   */
  compute(ids:ranges.RangeLike, idtype:idtypes.IDType):Promise<IScoreRow<T>[]>;
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
    const stack = l.data.push(r, createStackDesc('Combined'));
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
export function create(context:IViewContext, selection:ISelection, parent:Element, options?: IAViewOptions) {
  return new LineUpView(context, selection, parent, options);
}
