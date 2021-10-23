import * as React from "react";
import { DatavisynLogo } from "./headerComponents/DatavisynLogo";
import { AppDefaultLogo } from "./headerComponents/AppDefaultLogo";
import { BurgerMenu } from "./headerComponents/BurgerMenu";
import { ConfigurationMenu } from "./headerComponents/ConfigurationMenu";
export function VisynHeader({ extensions: { VisynLogo = React.createElement(DatavisynLogo, null), CustomerLogo = null, configurationMenu = React.createElement(ConfigurationMenu, { extensions: { menuItems: null } }), burgerMenu = React.createElement(BurgerMenu, { extensions: { sidebar: null } }), AppLogo = React.createElement(AppDefaultLogo, null), LeftExtensions = null, RightExtensions = null } = {}, burgerMenuEnabled = true, configMenuEnabled = true }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("nav", { className: "navbar navbar-expand-lg navbar-dark bg-dark" },
            React.createElement("div", { className: "container-fluid" },
                burgerMenu,
                AppLogo,
                React.createElement("button", { className: "navbar-toggler", type: "button", "data-toggle": "collapse", "data-target": "#headerNavbar" },
                    React.createElement("span", { className: "navbar-toggler-icon" })),
                React.createElement("div", { className: "ms-2 collapse navbar-collapse", id: "headerNavbar" }, LeftExtensions)),
            React.createElement("div", { className: "container-fluid justify-content-end" },
                CustomerLogo,
                VisynLogo,
                configurationMenu))));
}
//# sourceMappingURL=VisynHeader.js.map