/**
 * Created by sam on 13.02.2017.
 */
import {RangeLike, Range} from 'phovea_core/src/range';
import {IDType} from 'phovea_core/src/idtype';

export interface IScoreRow<T> {
  readonly id: string;
  score: T;
}

export interface IScore<T> {
  createDesc(): any;
  /**
   * Start the computation of the score for the given ids
   * @param ids
   * @param idtype
   */
  compute(ids: RangeLike, idtype: IDType): Promise<IScoreRow<T>[]>;
}

export default IScore;

export class AScoreAccessorProxy<T> {
  /**
   * the accessor for the score column
   * @param row
   * @param index
   */
  accessor = (row: any, index: number) => this.access(row);
  scores: Map<number, T> = null;

  constructor(private readonly row2key: (row: any) => number, private readonly missingValue: T = null) {

  }

  protected access(row: any) {
    const rowId = this.row2key(row);
    if (this.scores === null || !this.scores.has(rowId)) {
      return this.missingValue;
    }
    return this.scores.get(rowId);
  }
}

class NumberScoreAccessorProxy extends AScoreAccessorProxy<number> {
}


class CategoricalScoreAccessorProxy extends AScoreAccessorProxy<string> {

  protected access(row: any) {
    const v = super.access(row);
    return String(v); //even null values;
  }
}

/**
 * creates and accessor helper
 * @param colDesc
 * @param row2key
 * @returns {CategoricalScoreAccessorProxy|NumberScoreAccessorProxy}
 */
export function createAccessor(colDesc: any, row2key: (row: any) => number) {
  const accessor = colDesc.type === 'categorical' ? new CategoricalScoreAccessorProxy(row2key, colDesc.missingValue) : new NumberScoreAccessorProxy(row2key, colDesc.missingValue);
  colDesc.accessor = accessor.accessor;
  return accessor;
}
