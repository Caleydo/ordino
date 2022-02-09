import { PluginRegistry, useAsync, EXTENSION_POINT_VISYN_VIEW } from 'tdp_core';
export function useVisynViewPlugin(viewId) {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_VISYN_VIEW, viewId);
    //TODO:: Handle view being null
    const { value: viewPlugin } = useAsync(view.load, []);
    // TODO:: need to make this typesafe at some point
    return [viewPlugin, viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.factory()];
}
//# sourceMappingURL=useLoadWorkbenchViewPlugin.js.map