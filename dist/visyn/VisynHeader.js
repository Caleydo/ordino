import * as React from 'react';
import { DatavisynLogo } from './headerComponents/DatavisynLogo';
import { AppDefaultLogo } from './headerComponents/AppDefaultLogo';
import { BurgerMenu } from './headerComponents/BurgerMenu';
import { ConfigurationMenu } from './headerComponents/ConfigurationMenu';
export function VisynHeader({ ConfigMenuOptions = null, BurgerSidebar = null, extensions: { VisynLogo = DatavisynLogo, CustomerLogo = null, ConfigMenu = ConfigurationMenu, BurgerButton = BurgerMenu, AppLogo = AppDefaultLogo, LeftExtensions = null, RightExtensions = null } = {}, burgerMenuEnabled = true, configMenuEnabled = true }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("nav", { className: "navbar navbar-expand-lg navbar-dark bg-dark phovea-navbar" },
            React.createElement("div", { className: "container-fluid" },
                AppLogo,
                React.createElement("button", { className: "navbar-toggler", type: "button", "data-toggle": "collapse", "data-target": "#headerNavbar" },
                    React.createElement("span", { className: "navbar-toggler-icon" })),
                React.createElement("div", { className: "ms-2 collapse navbar-collapse", id: "headerNavbar" }, LeftExtensions)),
            React.createElement("div", { className: "container-fluid justify-content-end" },
                CustomerLogo,
                VisynLogo))));
}
//# sourceMappingURL=VisynHeader.js.map