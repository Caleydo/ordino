/* eslint-disable @typescript-eslint/no-use-before-define */
import { createTrrackableSlice } from '@trrack/redux';
import { store } from './store';
export class LineUpManager {
    constructor() {
        this.record = new Map();
    }
    static getInstance() {
        if (!LineUpManager.instance) {
            LineUpManager.instance = new LineUpManager();
        }
        return LineUpManager.instance;
    }
    register(id, instance) {
        this.record.set(id, instance);
        instance.getRankings().forEach((ranking) => {
            ranking.on('sortCriteriaChanged', LineUpManager.createSetSortCriteriaListenerFor(id, ranking.id));
        });
    }
    get(id) {
        const instance = this.record.get(id);
        if (!instance)
            throw new Error(`Lineup Instance ${id} not found`);
        return instance;
    }
    static createSetSortCriteriaListenerFor(instanceId, rankingId) {
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
            }));
        };
    }
}
export const lineupSlice = createTrrackableSlice({
    name: 'lineup',
    initialState: null,
    reducers: {
        setSortCriteriaTracker: (_state, _action) => {
            // do nothing
        },
        setSortCriteria: (state, action) => {
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
            ranking.setSortCriteria(action.payload.sortCriteria.map((v) => ({
                asc: v.asc,
                col: ranking.findByPath(v.col),
            })));
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
export const { setSortCriteria, 
// setGroupCriteria,
setSortCriteriaTracker, } = lineupSlice.actions;
export default lineupSlice.reducer;
//# sourceMappingURL=lineupSlice.js.map