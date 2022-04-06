import { IDTypeManager, isVisynViewPluginDesc, ViewUtils } from 'tdp_core';
export function isVisynRankingViewDesc(desc) {
    return isVisynViewPluginDesc(desc) && (desc === null || desc === void 0 ? void 0 : desc.visynViewType) === 'ranking';
}
export function isVisynRankingView(plugin) {
    return isVisynViewPluginDesc(plugin === null || plugin === void 0 ? void 0 : plugin.desc) && (plugin === null || plugin === void 0 ? void 0 : plugin.viewType) === 'ranking';
}
/**
 * Find all available workbenches to transition to for my workbench
 * @param idType
 * @returns available transitions
 */
export const findWorkbenchTransitions = async (idType) => {
    const views = await ViewUtils.findVisynViews(IDTypeManager.getInstance().resolveIdType(idType));
    return views.filter((v) => isVisynRankingViewDesc(v));
};
//# sourceMappingURL=interfaces.js.map