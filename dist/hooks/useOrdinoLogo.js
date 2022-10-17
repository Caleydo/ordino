import { useMemo } from 'react';
import { PluginRegistry, useAsync } from 'tdp_core';
import { EP_ORDINO_LOGO } from '../base';
export function useOrdinoLogo() {
    const loadOrdinoLogo = useMemo(() => async () => {
        const defaultSize = { width: 30, height: 30 };
        const plugins = PluginRegistry.getInstance().listPlugins(EP_ORDINO_LOGO);
        const plugin = plugins?.[0]; // use first registerd plugin; the order depends on import order in the phovea_registry.js of the workspace
        const module = await (await plugin.load()).factory();
        return {
            icon: module.default,
            text: plugin.text,
            width: plugin.width || defaultSize.width,
            height: plugin.height || defaultSize.height,
        };
    }, []);
    return useAsync(loadOrdinoLogo, []);
}
//# sourceMappingURL=useOrdinoLogo.js.map