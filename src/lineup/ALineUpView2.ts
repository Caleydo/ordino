/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
import {AView, EViewMode, IViewContext, ISelection, ViewWrapper} from '../View';
import LineUp, {ILineUpConfig} from 'lineupjs/src/lineup';
import Column from 'lineupjs/src/model/Column';
import {deriveColors} from 'lineupjs/src/';
import {ScaleMappingFunction, createSelectionDesc, Ranking} from 'lineupjs/src/model';
import CompositeColumn from 'lineupjs/src/model/CompositeColumn';
import ValueColumn from 'lineupjs/src/model/ValueColumn';
import NumberColumn from 'lineupjs/src/model/NumberColumn';
import {IBoxPlotData} from 'lineupjs/src/model/BoxPlotColumn';
import {LocalDataProvider,} from 'lineupjs/src/provider';
import * as d3 from 'd3';
import {resolve, IDType} from 'phovea_core/src/idtype';
import {list as rlist, RangeLike, Range} from 'phovea_core/src/range';
import * as cmds from './cmds';
import {saveNamedSet} from '../storage';
import {showErrorModalDialog} from '../Dialogs';
import {LineUpRankingButtons} from './LineUpRankingButtons';
import {LineUpSelectionHelper, array_diff, set_diff} from './LineUpSelectionHelper';
import IScore, {IScoreRow, createAccessor} from './IScore';
import {stringCol, useDefaultLayout} from './desc';
import {pushScoreAsync} from './scorecmds';

export abstract class ALineUpView2 extends AView {

  resolver: (d: any) => void;

  protected lineup: LineUp;

  protected additionalScoreParameter: any = null;

  private initLineUpPromise: Promise<any>;

  private config: ILineUpConfig = {
    renderingOptions: {
      histograms: true
    },
    header: {
      rankingButtons: ($node: d3.Selection<any>) => {
        const rb = new LineUpRankingButtons(this.lineup, $node, this.rowIDType, this.additionalScoreParameter);
        rb.on(LineUpRankingButtons.SAVE_NAMED_SET, (event, order, name, description, isPublic) => {
          this.saveNamedSet(order, name, description, isPublic);
        });
        rb.on(LineUpRankingButtons.ADD_SCORE_COLUMN, (event, scoreImpl) => {
          this.addScoreColumn(scoreImpl);
        });
        rb.on(LineUpRankingButtons.ADD_TRACKED_SCORE_COLUMN, (event, scoreId: string, params: any) => {
          this.pushTrackedScoreColumn(scoreId, params);
        });
        return rb;
      }
    },
    body: {}
  };

  protected rowIDType: IDType;

  /**
   * Stores the ranking data when collapsing columns on modeChange()
   * @type {any}
   */
  private dump: Map<string, number|boolean> = null;

  /**
   * DOM element with message when no data is available
   */
  protected $nodata: d3.Selection<any>;

  /**
   * DOM element for LineUp stats in parameter UI
   */
  private $params: d3.Selection<ViewWrapper>;

  private selectionHelper: LineUpSelectionHelper;

  protected idAccessor = (d) => d._id;

  /**
   * Map that keeps track of the columns being added or removed from detail views which can add multiple columns by setting different parameters
   */
  private dynamicColumns: Map<number, Set<string>> = new Map();

  constructor(context: IViewContext, protected selection: ISelection, parent: Element, private options?: {}) {
    super(context, parent, options);

    this.$node.classed('lineup', true);

    // hack in for providing the data provider within the graph
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
    this.selectionHelper = new LineUpSelectionHelper(this.lineup, this.rowIDType, this.idAccessor);
    this.selectionHelper.on(LineUpSelectionHelper.SET_ITEM_SELECTION, (event, selection) => {
      this.setItemSelection(selection);
    });
    this.selectionHelper.init();
    this.updateLineUpStats();
  }

  changeSelection(selection: ISelection) {
    super.changeSelection(selection);
    this.selection = selection;
    this.handleSelectionColumns(this.selection);
  }

  setItemSelection(selection: ISelection) {
    if (this.selectionHelper) {
      this.selectionHelper.setItemSelection(selection);
    }
    this.updateLineUpStats();
    super.setItemSelection(selection);
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any) => Promise<any>) {
    super.buildParameterUI($parent, onChange);

    // used for LineUp stats
    this.$params = $parent.append('div')
      .classed('form-group', true)
      .append('p');
  }

  getParameter(name: string): any {
    return super.getParameter(name);
  }

  setParameter(name: string, value: any) {
    const selectedIds = this.selection.range.dim(0).asList();
    this.addDynamicColumns(selectedIds);
    this.removeDynamicColumns(selectedIds);
    return super.setParameter(name, value);
  }

  /**
   * Expand/collapse certain columns on mode change.
   * Expand = focus view
   * Collapse = context view
   * @param mode
   */
  modeChanged(mode: EViewMode) {
    super.modeChanged(mode);
    if (!this.lineup) {
      return;
    }

    const data = <LocalDataProvider>this.lineup.data;

    if (mode === EViewMode.FOCUS) {
      if (this.dump) {
        const r = data.getRankings()[0];
        r.children.forEach((c) => {
          if (!this.dump.has(c.id)) {
            return;
          }
          if (c instanceof CompositeColumn) {
            c.setCompressed(false);
          } else {
            c.setWidth(<number>this.dump.get(c.id));
          }
        });
      }
      this.dump = null;

    } else if (this.dump === null) {
      const r = data.getRankings()[0];
      const s = r.getSortCriteria();
      const labelColumn = r.children.filter((c) => c.desc.type === 'string')[0];

      this.dump = new Map<string, number|boolean>();
      r.children.forEach((c) => {
        if (c === labelColumn ||
          c === s.col ||
          c.desc.type === 'rank' ||
          c.desc.type === 'selection' ||
          (<any>c.desc).column === 'id' // = Ensembl column
        ) {
          // keep these columns
        } else if (c instanceof CompositeColumn && !c.getCompressed()) {
          c.setCompressed(true);
          this.dump.set(c.id, true);
        } else {
          this.dump.set(c.id, c.getWidth());
          c.hide();
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

  private async saveNamedSet(order: number[], name: string, description: string, isPublic: boolean = false) {
    const r = this.selectionHelper.rows;
    const ids = rlist(order.map((i) => this.idAccessor(r[i])).sort(d3.ascending));

    const d = await saveNamedSet(name, this.rowIDType, ids, this.getSubType(), description, isPublic);
    console.log('saved', d);
    this.fire(AView.EVENT_UPDATE_ENTRY_POINT, this.rowIDType, d);
  }

  protected async handleSelectionColumns(selection: ISelection) {
    await this.initLineUpPromise;
    this.handleSelectionColumnsImpl(selection);
  }

  private addDynamicColumns(ids: number[]) {
    const addColumn = (desc, newColumnPromise, id) => {
      //mark as lazy loaded
      (<any>desc).lazyLoaded = true;
      this.withoutTracking(() => {
        this.addColumn(desc, newColumnPromise, id, true); // true == withoutTracking
      });
    };

    ids.forEach((id) => {
      this.getSelectionColumnDesc(id)
        .then((columnDesc) => {


          // add multiple columns
          if(Array.isArray(columnDesc)) {
            if(columnDesc.length > 0) {
              if(!this.dynamicColumns.has(id)) {
               this.dynamicColumns.set(id, new Set());
              }

              // Save which columns have been added for a specific element in the selection
              const selectedElements = new Set(columnDesc.map((desc) => desc.selectionOptions.id));

              // Check which items are new and should therefore be added as columns
              const addedParameters = set_diff(selectedElements, this.dynamicColumns.get(id));
              addedParameters.forEach((value) => this.dynamicColumns.get(id).add(value));

              if(addedParameters.size > 0) {
                // Filter the descriptions to only leave the new columns and load them
                const columnsToBeAdded = columnDesc.filter((desc) => addedParameters.has(desc.selectionOptions.id));
                const newColumns = this.loadSelectionColumnData.call(this, id, columnsToBeAdded);

                // add new columns
                newColumns.then((dataPromise) => {
                  columnsToBeAdded.forEach((desc, i) => {
                    addColumn(desc, dataPromise[i], id);
                  });
                });
              }
            }
          } else { // single column
            addColumn(columnDesc, this.loadSelectionColumnData.call(this, id), id);
          }
        });
    });
  }

  private removeDynamicColumns(ids: number[]) {
    const ranking = this.lineup.data.getLastRanking();
    ids.forEach((id) => {
      if(!this.dynamicColumns.has(id)) {
        return;
      }
      this.getSelectionColumnDesc(id)
        .then((columnDesc) => {
          if(Array.isArray(columnDesc)) {
            const usedCols = ranking.flatColumns.filter((col) => (<any>col.desc).selectionOptions !== undefined);

            // check which parameters are currently selected and get the IDs
            const selectedElements = new Set<string>(columnDesc.map((desc) => desc.selectionOptions.id));

            // check which parameters have been removed
            const removedParameters = set_diff(this.dynamicColumns.get(id), selectedElements);

            if(removedParameters.size > 0) {
              removedParameters.forEach((param) => {
                this.dynamicColumns.get(id).delete(param);
                const col = usedCols.find((d) => (<any>d.desc).selectionOptions.id === param);
                ranking.remove(col);
              });
            }
          }
        });
    });
  }

  protected handleSelectionColumnsImpl(selection: ISelection) {
    const selectedIds = selection.range.dim(0).asList();

    const ranking = this.lineup.data.getLastRanking();
    const usedCols = ranking.flatColumns.filter((d) => (<any>d.desc).selectedId !== -1);
    const lineupColIds = usedCols
      .map((d) => (<any>d.desc).selectedId)
      .filter((d) => d !== undefined);

    // compute the difference
    const diffAdded = array_diff(selectedIds, lineupColIds);
    const diffRemoved = array_diff(lineupColIds, selectedIds);

    // add new columns to the end
    if (diffAdded.length > 0) {
      //console.log('add columns', diffAdded);
      this.addDynamicColumns(diffAdded);
    }

    // remove deselected columns
    if (diffRemoved.length > 0) {
      this.withoutTracking(() => {
        //console.log('remove columns', diffRemoved);

        diffRemoved.forEach((id) => {
          const cols = usedCols.filter((d) => (<any>d.desc).selectedId === id);
          cols.forEach((col) => ranking.remove(col));
        });
      });
    }
  }

  protected getSelectionColumnId(id: number): string {
    // hook
    return `col_${id}`;
  }

  protected getSelectionColumnLabel(id: number): Promise<string> {
    // hook
    return Promise.resolve(`Selection ${id}`);
  }

  protected async getSelectionColumnDesc(id): Promise<any|any[]> {
    const label = await this.getSelectionColumnLabel(id);
    return stringCol(this.getSelectionColumnId(id), label, true, 50, id);
  }

  protected addColumn(colDesc: any, loadPromise: Promise<IScoreRow<any>[]>, id = -1, withoutTracking = false): { col: Column, loaded: Promise<Column>} {
    const ranking = this.lineup.data.getLastRanking();
    const colors = this.getAvailableColumnColors(ranking);

    colDesc.color = colors.shift(); // get and remove color from list
    const accessor = createAccessor(colDesc, this.idAccessor);

    const provider = <LocalDataProvider>this.lineup.data;
    provider.pushDesc(colDesc);
    const col = <ValueColumn<any>>this.lineup.data.push(ranking, colDesc);

    // error handling
    loadPromise
      .catch(showErrorModalDialog)
      .catch(() => {
        ranking.remove(col);
      });

    // success
    const loaded = loadPromise
    // map selection rows
      .then((rows: IScoreRow<any>[]) => {
        if (id !== -1) {
          return this.mapSelectionRows(rows);
        }
        return rows;
      })
      // convert to score array to object to use in LineUp
      .then((rows: IScoreRow<any>[]) => {
        const r = new Map<number, any>();
        rows.forEach((row) => {
          r.set(this.selectionHelper.underscoreIdAccessor(row.id), row.score);
        });
        return r;
      })
      .then((scores) => {
        accessor.scores = scores;

        if (colDesc.type === 'number') {
          const ncol = <NumberColumn>col;
          if (!(colDesc.constantDomain)) { //create a dynamic range if not fixed
            const domain = d3.extent(<number[]>(Array.from(scores.values())));
            //HACK by pass the setMapping function and set it inplace
            const ori = <ScaleMappingFunction>(<any>ncol).original;
            const current = <ScaleMappingFunction>(<any>ncol).mapping;
            colDesc.domain = domain;
            ori.domain = domain;
            current.domain = domain;
          }
        } else if (colDesc.type === 'boxplot') {
          //HACK we know that the domain of the description is just referenced, so we can update it by changing values!
          if (!(colDesc.constantDomain)) { //create a dynamic range if not fixed
            const values = <IBoxPlotData[]>Array.from(scores.values());
            colDesc.domain[0] = d3.min(values, (d) => d.min);
            colDesc.domain[1] = d3.max(values, (d) => d.max);
          }
        }
        col.setLoaded(true);
        this.lineup.update();
        return col;
      });

    return {col, loaded};
  }

  protected mapSelectionRows(rows: IScoreRow<any>[]) {
    // hook
    return rows;
  }

  protected getAvailableColumnColors(ranking = this.lineup.data.getLastRanking()) {
    const colors = d3.scale.category10().range().slice();
    // remove colors that are already in use from the list
    ranking.flatColumns.forEach((d) => {
      const i = colors.indexOf(d.color);
      if (i > -1) {
        colors.splice(i, 1);
      }
    });
    return colors;
  }

  protected loadSelectionColumnData(id: number, desc?: any): Promise<IScoreRow<any>[]>|Promise<IScoreRow<any>[]>[] {
    // hook
    return Promise.resolve([]);
  }

  private addScoreColumn(score: IScore<any>) {
    const colDesc = score.createDesc();
    // flag that it is a score
    colDesc._score = true;

    const loadScoreColumn = () => {
      return score.compute(this.selectionHelper.rowIdsAsSet(this.lineup.data.getRankings()[0].getOrder()), this.rowIDType, this.extraComputeScoreParam());
    };
    return this.addColumn(colDesc, loadScoreColumn());
  }

  protected extraComputeScoreParam(): any {
    return null;
  }

  addTrackedScoreColumn(score: IScore<any>) {
    return this.withoutTracking(() => this.addScoreColumn(score));
  }

  pushTrackedScoreColumn(scoreId: string, params: any) {
    return pushScoreAsync(this.context.graph, this.context.ref, scoreId, params);
  }

  removeTrackedScoreColumn(columnId: string) {
    return this.withoutTracking((lineup) => {
      const column = lineup.data.find(columnId);
      return column.removeMe();
    });
  }

  destroy() {
    if (this.lineup) {
      this.lineup.on('updateStart', null);
      this.lineup.on('updateFinished', null);
    }
    super.destroy();
  }

  protected build(rows: any[] = [], columns: any[] = []) {
    // prevent re-initialization
    if (this.lineup) {
      return;
    }

    deriveColors(columns);

    const storage = new LocalDataProvider(rows, columns);
    this.lineup = new LineUp(this.node, storage, this.config);
    this.initSelectionHelper();

    const ranking = this.lineup.data.pushRanking();

    this.buildInitialRanking(ranking, columns);

    // add selection column
    useDefaultLayout(this.lineup);
    this.lineup.update();
  }

  protected buildInitialRanking(ranking: Ranking, columns: any[]) {
    columns.forEach((d, i) => {
      // add visible columns
      if (d.visible) {
        this.lineup.data.push(ranking, d);
      }

      // set initial column width
      if (d.width > -1) {
        ranking.children[i + 1].setWidth(d.width); // i+1 because first column == rank
      }
    });
  }

  private async updateImpl() {
    const desc: {idType: string, columns: any[]} = await this.loadColumnDesc();
    this.initColumns(desc);
    const rows = await this.loadRows();
    this.initRows(rows);
    this.initializedLineUp();
    this.setBusy(false);
  }

  protected async update() {
    this.setBusy(true);
    this.initLineUpPromise = this.updateImpl();
    this.initLineUpPromise
      .catch(() => {
        this.setBusy(false);
      });
  }

  protected loadColumnDesc(): Promise<{idType: string, columns: any[]}> {
    // hook
    return Promise.resolve({idType: '', columns: []});
  }

  protected initColumns(desc: {idType: string}) {
    this.rowIDType = resolve(desc.idType);
  }

  protected loadRows(): Promise<any[]> {
    // hook
    return Promise.resolve([]);
  }

  protected initRows(rows: any[]) {
    this.$nodata.classed('hidden', (rows.length > 0));
    // no data available
    if (rows.length === 0) {
      return [];
    }

    rows = this.mapRows(rows);

    this.fillIDTypeMapCache(this.rowIDType, rows);
    const provider = <LocalDataProvider>this.lineup.data;
    provider.setData(rows);
    this.selectionHelper.rows = rows;
    //reset the selection in LineUp
    this.selectionHelper.setItemSelection(this.getItemSelection());
    return rows;
  }

  protected mapRows(rows: any[]) {
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

  protected async withoutTracking<T>(f: (lineup: any) => T): Promise<T> {
    await cmds.untrack(this.context.ref);
    const r = f(this.lineup);
    await cmds.clueify(this.context.ref, this.context.graph);
    return r;
  }

  /**
   * Fill the idType map cache
   * The goal is to avoid further mapping request from the id resolver to the server
   * @param idtype
   * @param rows
   */
  protected fillIDTypeMapCache(idtype: IDType, rows: {_id: number, id: string}[]) {
    const ids = [], names = [];
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
     */
    const showStats = (total: number, selected = 0, shown = 0) => {
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


    // this.lineup not available
    if (!this.lineup) {
      this.$params.html(showStats(0, 0));
      return;
    }

    const selected = this.lineup.data.getSelection().length;
    const total = (<LocalDataProvider>this.lineup.data).data.length;

    const r = this.lineup.data.getRankings()[0];
    if (r) {
      // needs a setTimeout, because LineUp needs time to filter the rows
      const id = setTimeout(() => {
        clearTimeout(id);
        const shown = r.getOrder().length;
        this.$params.html(showStats(total, selected, shown));
      }, 150); // adjust the time depending on the number of rows(?)
    } else {
      this.$params.html(showStats(total, selected));
    }
  }

  protected getItemName(count: number): string {
    return (count === 1) ? 'item' : 'items';
  }

  /**
   * Destroy LineUp instance
   */
  protected clear() {
    if (this.lineup) {
      this.lineup.destroy();
      this.lineup = undefined; // delete ref to call this.build() again

      this.selectionHelper.destroy();
      this.selectionHelper = undefined;
    }
  }

}

export default ALineUpView2;
