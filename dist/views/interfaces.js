import { isVisynViewPluginDesc } from 'tdp_core';
export function isVisynRankingViewDesc(desc) {
    return isVisynViewPluginDesc(desc) && (desc === null || desc === void 0 ? void 0 : desc.visynViewType) === 'ranking';
}
export function isVisynRankingView(plugin) {
    return isVisynViewPluginDesc(plugin === null || plugin === void 0 ? void 0 : plugin.desc) && (plugin === null || plugin === void 0 ? void 0 : plugin.viewType) === 'ranking';
}
//# sourceMappingURL=interfaces.js.map