import { IDTypeManager, isVisynViewPluginDesc, ViewUtils } from 'tdp_core';
/**
 * relation list types?
 */
export var EReprovisynRelationList;
(function (EReprovisynRelationList) {
    EReprovisynRelationList[EReprovisynRelationList["filter"] = 0] = "filter";
    EReprovisynRelationList[EReprovisynRelationList["all"] = 1] = "all";
})(EReprovisynRelationList || (EReprovisynRelationList = {}));
export var EReprovisynScoreType;
(function (EReprovisynScoreType) {
    EReprovisynScoreType[EReprovisynScoreType["GenericDBScore"] = 0] = "GenericDBScore";
    EReprovisynScoreType[EReprovisynScoreType["CustomScoreImplementation"] = 1] = "CustomScoreImplementation";
})(EReprovisynScoreType || (EReprovisynScoreType = {}));
export var EReprovisynColumnType;
(function (EReprovisynColumnType) {
    EReprovisynColumnType["categorical"] = "categorical";
    EReprovisynColumnType["number"] = "number";
    EReprovisynColumnType["string"] = "string";
})(EReprovisynColumnType || (EReprovisynColumnType = {}));
/**
 * reprovisyn relation type
 */
export var ETransitionType;
(function (ETransitionType) {
    ETransitionType["OneToN"] = "1-n";
    ETransitionType["MToN"] = "m-n";
    ETransitionType["OrdinoDrilldown"] = "ordino-drilldown";
})(ETransitionType || (ETransitionType = {}));
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