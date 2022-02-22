import { PluginRegistry, useAsync, EXTENSION_POINT_VISYN_VIEW } from 'tdp_core';
export function useVisynViewPlugin(viewId) {
    const view = PluginRegistry.getInstance().getVisynPlugin(EXTENSION_POINT_VISYN_VIEW, viewId);
    // TODO:: Handle view being null
    const { status, value: viewPlugin } = useAsync(view.load, []);
    console.log(viewPlugin);
    // TODO:: need to make this typesafe at some point
    return [viewPlugin, () => (viewPlugin ? viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.factory() : null)];
}
//# sourceMappingURL=useLoadWorkbenchViewPlugin.js.map