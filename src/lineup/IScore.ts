/**
 * Created by sam on 13.02.2017.
 */
import {RangeLike, Range} from 'phovea_core/src/range';
import {IDType} from 'phovea_core/src/idtype';

export interface IScoreRow<T> {
  readonly id: string;
  readonly score: T;
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
