import { DefineVisynViewPlugin, IServerColumn, VisynDataViewPluginType } from 'tdp_core';
export declare type VisynRankingViewPluginType<Param extends Record<string, unknown> = Record<string, unknown>, Desc extends Record<string, unknown> = Record<string, unknown>> = DefineVisynViewPlugin<'ranking', Param, {
    /**
     * Data array matching the columns defined in the `dataDesc`.
     */
    data: Record<string, unknown>[];
    /**
     * Data column description describing the given `data`.
     * TODO:: Type to IReprovisynServerColumn when we merge that into tdp_core
     */
    dataDesc: IServerColumn[] | any[];
}, Desc>;
export declare function isVisynRankingViewDesc(desc: unknown): desc is VisynDataViewPluginType['desc'];
export declare function isVisynRankingView(plugin: unknown): plugin is VisynDataViewPluginType['plugin'];
//# sourceMappingURL=interfaces.d.ts.map