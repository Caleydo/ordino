/**
 * Created by sam on 13.02.2017.
 */

import {ISelection} from '../View';
import * as d3 from 'd3';
import {IDType} from 'phovea_core/src/idtype';
import {list as rlist} from 'phovea_core/src/range';
import {EventHandler} from 'phovea_core/src/event';


/**
 * Returns the all items that are not in the given two arrays
 * TODO improve performance of diff algorithm
 * @param array1
 * @param array2
 * @returns {any}
 */
export function array_diff<T>(array1: T[], array2: T[]) {
  return array1.filter((elm) => array2.indexOf(elm) === -1);
}

/**
 * Returns all elements from set1 which are not in set2
 * @param set1
 * @param set2
 * @returns Set<T>
 */
export function set_diff<T>(set1: Set<T>, set2: Set<T>) : Set<T> {
  const diff = new Set();
  set1.forEach((elem) => {
    if(!set2.has(elem)) {
      diff.add(elem);
    }
  });
  return diff;
}

export class LineUpSelectionHelper extends EventHandler {
  static readonly SET_ITEM_SELECTION = 'setItemSelection';

  private _rows: any[] = [];

  private orderedSelectionIndicies: number[] = [];

  private id2index = d3.map<number>();
  public index2id = d3.map<number>();

  // key: id (e.g., Ensembl), value: _id (Caleydo Mapping Id from Redis DB)
  private id2UnderscoreId = d3.map<number>();

  // Returns the _id for a given `id`
  public underscoreIdAccessor = (id: string) => this.id2UnderscoreId.get(id);

  constructor(private lineup, private idType: IDType, private idAccessor) {
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
    this.lineup.on('multiSelectionChanged', (indices) => {
      this.onMultiSelectionChanged(indices);
    });
  }

  private removeEventListener() {
    this.lineup.on('multiSelectionChanged', null);
  }

  private onMultiSelectionChanged(indices) {
    // compute the difference
    const diffAdded = array_diff(indices, this.orderedSelectionIndicies);
    const diffRemoved = array_diff(this.orderedSelectionIndicies, indices);

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

    const ids = rlist(this.orderedSelectionIndicies.map((i) => this.idAccessor(this._rows[i])));
    //console.log(this.orderedSelectionIndicies, ids.toString(), diffAdded, diffRemoved);

    const selection: ISelection = {idtype: this.idType, range: ids};
    // Note: listener of that event calls LineUpSelectionHelper.setItemSelection()
    this.fire(LineUpSelectionHelper.SET_ITEM_SELECTION, selection);
  }

  set rows(rows: any[]) {
    this._rows = rows;
    this.buildCache();
  }

  get rows(): any[] {
    return this._rows;
  }

  /**
   * gets the rows ids as a set, i.e. the order doesn't mean anything
   */
  rowIdsAsSet(indices: number[]) {
    let ids: number[];
    if (indices.length === this._rows.length) {
      ids = this._rows.map((d) => this.idAccessor(d));
    } else {
      ids = indices.map((i) => this.index2id.get(String(i)));
    }
    ids.sort((a, b) => a - b); // sort by number
    return rlist(ids);
  }

  setItemSelection(sel: ISelection) {
    if (!this.lineup) {
      return;
    }

    const indices: number[] = [];
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
