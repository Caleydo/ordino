/**
 * Created by sam on 13.02.2017.
 */
import {IViewContext, ISelection} from '../View';
import {createStackDesc} from 'lineupjs/src/model';
import * as d3 from 'd3';
import {resolve, IDType} from 'phovea_core/src/idtype';
import ALineUpView from './ALineUpView';
import {stringCol, numberCol} from './desc';

/**
 * Sample LineUp view with random data
 * @deprecated For testing purpose only
 */
export default class LineUpView extends ALineUpView {
  constructor(context: IViewContext, selection: ISelection, parent: Element, options?) {
    super(context, parent, options);
    //TODO
    this.build();
  }

  private build() {
    //generate random data
    const rows = d3.range(300).map((i) => ({name: '' + i, id: i, v1: Math.random() * 100, v2: Math.random() * 100}));

    const columns = [stringCol('name'), numberCol('v1', rows), numberCol('v2', rows)];
    const l = this.buildLineUp(rows, columns, resolve('DummyRow'), (r) => r.id);
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
export function create(context: IViewContext, selection: ISelection, parent: Element, options?: {}) {
  return new LineUpView(context, selection, parent, options);
}
