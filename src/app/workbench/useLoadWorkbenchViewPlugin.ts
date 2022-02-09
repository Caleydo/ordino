import {IViewPluginDesc, PluginRegistry, useAsync, EXTENSION_POINT_VISYN_VIEW, IVisynViewPlugin, IVisynViewPluginDesc, IVisynViewPluginFactory} from 'tdp_core';

export function useVisynViewPlugin(viewId: string): [IVisynViewPlugin, IVisynViewPluginFactory] {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_VISYN_VIEW, viewId);

    //TODO:: Handle view being null
    const {value: viewPlugin} = useAsync(view.load, []);

    // TODO:: need to make this typesafe at some point
    return [viewPlugin, viewPlugin?.factory()];
}

