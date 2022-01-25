import {IViewPluginDesc, PluginRegistry, useAsync, EXTENSION_POINT_VISYN_VIEW, IVisynViewPlugin} from 'tdp_core';

export function useVisynViewPlugin(viewId: string): IVisynViewPlugin | null {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_VISYN_VIEW, viewId) as IViewPluginDesc;

    const {value: viewPlugin} = useAsync(view.load, []);

    // TODO:: need to make this typesafe at some point
    //@ts-ignore
    return viewPlugin;
}

