import React from 'react';
import {EXTENSION_POINT_TDP_VIEW, IViewPluginDesc,PluginRegistry, useAsync} from 'tdp_core';


export function useLoadView(viewId: string) {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId) as IViewPluginDesc;
    const loadView = React.useMemo(() => () => {
        return view.load();
    }, []);
    return useAsync(loadView, []);
}
