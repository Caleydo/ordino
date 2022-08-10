/* eslint-disable @typescript-eslint/no-use-before-define */
import { createTrrackableSlice } from '@trrack/redux';
import { LocalDataProvider, ISortCriteria } from 'lineupjs';
import { PayloadAction } from '@reduxjs/toolkit';
import { store } from './store';

interface ISerializedSortCriteria extends Pick<ISortCriteria, 'asc'> {
  col: string;
}

export class LineUpManager {
  private static instance: LineUpManager;

  private record: Map<string, LocalDataProvider> = new Map();

  static getInstance(): LineUpManager {
    if (!LineUpManager.instance) {
      LineUpManager.instance = new LineUpManager();
    }
    return LineUpManager.instance;
  }

  register(id: string, instance: LocalDataProvider) {
    this.record.set(id, instance);

    instance.getRankings().forEach((ranking) => {
      ranking.on('sortCriteriaChanged', LineUpManager.createSetSortCriteriaListenerFor(id, ranking.id));
    });
  }

  get(id: string): LocalDataProvider {
    const instance = this.record.get(id);
    if (!instance) throw new Error(`Lineup Instance ${id} not found`);

    return instance;
  }

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
      ranking.setSortCriteria(
        action.payload.sortCriteria.map((v) => ({
          asc: v.asc,
          col: ranking.findByPath(v.col),
        })),
      );
      ranking.on('sortCriteriaChanged', LineUpManager.createSetSortCriteriaListenerFor(action.payload.instanceId, ranking.id));
      // TODO: Wait for ranking to be ready
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
