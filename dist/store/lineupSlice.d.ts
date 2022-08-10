import { LocalDataProvider } from 'lineupjs';
export declare class LineUpManager {
    private static instance;
    private record;
    static getInstance(): LineUpManager;
    register(id: string, instance: LocalDataProvider): void;
    get(id: string): LocalDataProvider;
    static createSetSortCriteriaListenerFor(instanceId: string, rankingId: string): (prev: any, cur: any) => void;
}
export declare const lineupSlice: any;
export declare const setSortCriteria: any, setSortCriteriaTracker: any;
declare const _default: any;
export default _default;
//# sourceMappingURL=lineupSlice.d.ts.map