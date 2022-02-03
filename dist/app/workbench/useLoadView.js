import React from 'react';
import { EXTENSION_POINT_TDP_VIEW, PluginRegistry, useAsync } from 'tdp_core';
export function useLoadView(viewId) {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
    const loadView = React.useMemo(() => () => {
        return view.load();
    }, []);
    return useAsync(loadView, []);
}
//# sourceMappingURL=useLoadView.js.map