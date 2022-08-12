/* eslint-disable @typescript-eslint/no-use-before-define */
import { createTrrackableSlice } from '@trrack/redux';
import { LocalDataProvider, ISortCriteria } from 'lineupjs';
import { PayloadAction } from '@reduxjs/toolkit';
import { store } from './store';
import { Ranking } from 'lineupjs';

interface ISerializedSortCriteria extends Pick<ISortCriteria, 'asc'> {
  col: string;
}



// TODO: Add other lineup actions like Groups, Filters, Aggs, etc.
export class LineUpManager {
  private static instance: LineUpManager;

  /**
   * Maps each instance of lineup to a deterministic id.
   */
  private record: Map<string, LocalDataProvider> = new Map();

  /**
   * To access the static instance of the LineUpManager
   */
  static getInstance(): LineUpManager {
    if (!LineUpManager.instance) {
      LineUpManager.instance = new LineUpManager();
    }
    return LineUpManager.instance;
  }

  /**
   *
   * @param id Deterministic id for lineup instance
   * @param instance Lineup or dataprovider instance (currently GenericRanking only gives access to dataprovider)
   */
  register(id: string, instance: LocalDataProvider) {
    this.record.set(id, instance);

    instance.getRankings().forEach((ranking) => {
      ranking.on('sortCriteriaChanged', LineUpManager.createSetSortCriteriaListenerFor(id, ranking.id));
    });
  }

  /**
   * Used to access a specific lineup/dataprovider instance.
   * @param id - instance id to get.
   * @returns DataProvider instance
   */
  get(id: string): LocalDataProvider {
    const instance = this.record.get(id);
    if (!instance) throw new Error(`Lineup Instance ${id} not found`);

    return instance;
  }

  /**
   * Creates a promise that resolves when the ranking is ordered and next action can be safely executed.
   * @param ranking Ranking to monitor
   * @returns A promise that resolves when the ranking has ordered itself.
   */
  static dirtyRankingWaiter(ranking) {
    let waiter: Promise<void> | null = null;

    ranking.on(`${Ranking.EVENT_DIRTY_ORDER}.trrack`, () => {
      ranking.on(`${Ranking.EVENT_DIRTY_ORDER}.trrack`, null);

      let resolver: () => void;

      waiter = new Promise<void>((res) => {
        resolver = res;
      });

      ranking.on(`${Ranking.EVENT_ORDER_CHANGED}.trrack`, () => {
        ranking.on(`${Ranking.EVENT_ORDER_CHANGED}.trrack`, null);
        resolver();
      });
    });

    return waiter;
  }

  /**
   * This is a utility function to create the event handler that can be used during initial setup or by trrack internally during execution.
   * This is the template to use for creating event handlers for tother
   *
   * @param instanceId instance id to add sort.
   * @param rankingId ranking id to sort.
   * @returns event handler to supply to setSortCriteria event on a ranking.
   */
  static createSetSortCriteriaListenerFor(instanceId: string, rankingId: string) {
    return (prev, cur) => {
      store.dispatch(
        // TODO: Figure out how to do that, maybe in async thunks?
        setSortCriteriaTracker({
          instanceId,
          rankingId,
          previous: prev.map((v) => ({
            col: v.col.fqpath,
            asc: v.asc,
          })),
          current: cur.map((v) => ({
            col: v.col.fqpath,
            asc: v.asc,
          })),
        }),
      );
    };
  }
}

export const lineupSlice = createTrrackableSlice({
  name: 'lineup',
  initialState: null,
  reducers: {
    setSortCriteriaTracker: (
      _state,
      _action: PayloadAction<{
        instanceId: string;
        rankingId: string;
        previous: ISerializedSortCriteria[];
        current: ISerializedSortCriteria[];
      }>,
    ) => {
      // do nothing
    },
    setSortCriteria: (
      state,
      action: PayloadAction<{
        instanceId: string;
        rankingId: string;
        sortCriteria: ISerializedSortCriteria[];
      }>,
    ) => {
      const ranking = LineUpManager.getInstance()
        .get(action.payload.instanceId)
        .getRankings()
        .find((r) => r.id === action.payload.rankingId);

      if (!ranking) {
        // TODO: How to recover here?
        throw Error('Ranking not found');
      }

      // TODO: Find better way of attaching listeners

      // Add utility function for disabling certain events
      // const listenerBackup = ranking.getListener('.....track');
      // ranking.listener['...track'].pause();
      ranking.on('sortCriteriaChanged', null);
      const wait = LineUpManager.dirtyRankingWaiter(ranking);
      ranking.setSortCriteria(
        action.payload.sortCriteria.map((v) => ({
          asc: v.asc,
          col: ranking.findByPath(v.col),
        })),
      );
      ranking.on('sortCriteriaChanged', LineUpManager.createSetSortCriteriaListenerFor(action.payload.instanceId, ranking.id));
      return wait;
      // TODO: Wait for ranking to be ready. Implement the current dirtyRankingWaiter to show asyncDispatch
      // await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  doUndoActionCreators: {
    // ...setGroupCriteriaCreators,
    // TODO: Why is this needed, as without that the reducer can not be found
    setSortCriteria: () => ({}),
    setSortCriteriaTracker: ({ action }) => ({
      do: setSortCriteria({
        rankingId: action.payload.rankingId,
        instanceId: action.payload.instanceId,
        sortCriteria: action.payload.current,
      }),
      undo: setSortCriteria({
        rankingId: action.payload.rankingId,
        instanceId: action.payload.instanceId,
        sortCriteria: action.payload.previous,
      }),
    }),
  },
});

export const {
  setSortCriteria,
  // setGroupCriteria,
  setSortCriteriaTracker,
} = lineupSlice.actions;

export default lineupSlice.reducer;
