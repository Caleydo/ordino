import { PluginRegistry, useAsync, EXTENSION_POINT_VISYN_VIEW } from 'tdp_core';
export function useVisynViewPlugin(index, viewId) {
    const view = PluginRegistry.getInstance().getVisynPlugin(EXTENSION_POINT_VISYN_VIEW, viewId);
    // TODO:: Handle view being null
    const { status, value: viewPlugin } = useAsync(view.load, []);
    // TODO:: need to make this typesafe at some point
    return viewPlugin ? { ...viewPlugin } : null;
}
//# sourceMappingURL=useLoadWorkbenchViewPlugin.js.map