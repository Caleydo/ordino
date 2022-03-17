import { isVisynViewPluginDesc } from 'tdp_core';
export function isVisynRankingViewDesc(desc) {
    var _a;
    return isVisynViewPluginDesc(desc) && ((_a = desc) === null || _a === void 0 ? void 0 : _a.visynViewType) === 'ranking';
}
export function isVisynRankingView(plugin) {
    var _a, _b;
    return isVisynViewPluginDesc((_a = plugin) === null || _a === void 0 ? void 0 : _a.desc) && ((_b = plugin) === null || _b === void 0 ? void 0 : _b.viewType) === 'ranking';
}
// TODO:: Create interfaces for Ranking, Visyn and Cosmic views
//# sourceMappingURL=interfaces.js.map