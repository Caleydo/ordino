import { PluginRegistry, useAsync, EXTENSION_POINT_VISYN_VIEW } from 'tdp_core';
export function useVisynViewPlugin(viewId) {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_VISYN_VIEW, viewId);
    const { value: viewPlugin } = useAsync(view.load, []);
    // TODO:: need to make this typesafe at some point
    //@ts-ignore
    return viewPlugin;
}
//# sourceMappingURL=useLoadWorkbenchViewPlugin.js.map