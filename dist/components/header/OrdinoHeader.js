import * as React from 'react';
import { ConfigMenuOptions, ConfigurationMenu, HeaderTabs, OrdinoLogo2, VisynHeader } from '../..';
export function OrdinoHeader({ extensions: { tabs = null, customerLogo = null, } = {} }) {
    return (React.createElement(VisynHeader, { burgerMenuEnabled: false, extensions: {
            CustomerLogo: customerLogo,
            AppLogo: React.createElement(OrdinoLogo2, null),
            LeftExtensions: React.createElement(HeaderTabs, null),
            configurationMenu: React.createElement(ConfigurationMenu, { extensions: { menuItems: React.createElement(ConfigMenuOptions, null) } })
        } }));
}
//# sourceMappingURL=OrdinoHeader.js.map