import * as React from 'react';
import { useAsync } from '../hooks';
import { useMemo } from 'react';
import { PluginRegistry } from 'phovea_core';
import { EP_ORDINO_LOGO } from '../base';
export function OrdinoLogo() {
    const loadOrdinoLogo = useMemo(() => async () => {
        const plugins = PluginRegistry.getInstance().listPlugins(EP_ORDINO_LOGO);
        const plugin = plugins === null || plugins === void 0 ? void 0 : plugins[plugins.length - 1]; // take the last registered plugin
        const module = await (await plugin.load()).factory();
        return {
            icon: module.default,
            text: plugin.text
        };
    }, []);
    const { status, value } = useAsync(loadOrdinoLogo);
    return (React.createElement(React.Fragment, null, status === 'success' &&
        React.createElement("div", { className: "ordino-logo" },
            React.createElement("img", { alt: "", src: value.icon, width: "30", height: "30" }),
            ' ',
            value.text)));
}
//# sourceMappingURL=OrdinoLogo.js.map