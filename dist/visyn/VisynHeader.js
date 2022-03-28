import * as React from 'react';
import { visynHeaderComponents } from './headerConfig';
export function VisynHeader({ ConfigMenuOptions = null, BurgerSidebar = null, extensions = {}, burgerMenuEnabled = false }) {
    const { AppLogo, VisynLogo, CustomerLogo, BurgerButton, LeftExtensions, RightExtensions, SettingsMenu } = { ...visynHeaderComponents, ...extensions };
    return (React.createElement("nav", { className: " visyn-navbar navbar navbar-expand-lg navbar-dark bg-dark" },
        React.createElement("div", { className: "container-fluid" },
            AppLogo ? React.createElement(AppLogo, null) : null,
            React.createElement("button", { className: "navbar-toggler", type: "button", "data-toggle": "collapse", "data-target": "#navbarSupportedContent", "aria-controls": "navbarSupportedContent", "aria-expanded": "false", "aria-label": "Toggle navigation" },
                React.createElement("span", { className: "navbar-toggler-icon" })),
            React.createElement("div", { className: "collapse navbar-collapse" },
                LeftExtensions ? React.createElement(LeftExtensions, null) : null,
                React.createElement("ul", { className: "navbar-nav ms-auto align-items-end" },
                    CustomerLogo ? React.createElement(CustomerLogo, null) : null,
                    VisynLogo ? React.createElement(VisynLogo, null) : null),
                React.createElement("ul", { className: "navbar-nav align-items-end" },
                    RightExtensions ? React.createElement(RightExtensions, null) : null,
                    SettingsMenu ? React.createElement(SettingsMenu, { menuItems: ConfigMenuOptions ? React.createElement(ConfigMenuOptions, null) : null }) : null)))));
}
//# sourceMappingURL=VisynHeader.js.map