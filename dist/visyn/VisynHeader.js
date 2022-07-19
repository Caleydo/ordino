import React from 'react';
import { useAppSelector } from '../hooks';
import { visynHeaderComponents } from './headerConfig';
export function VisynHeader({ ConfigMenuOptions = null, BurgerSidebar = null, extensions = {}, burgerMenuEnabled = false }) {
    const { AppLogo, VisynLogo, CustomerLogo, BurgerButton, LeftExtensions, RightExtensions, SettingsMenu } = { ...visynHeaderComponents, ...extensions };
    const projectName = useAppSelector((state) => state.menu.currentProject);
    return (React.createElement("nav", { className: " visyn-navbar navbar navbar-expand-lg navbar-dark bg-dark" },
        React.createElement("div", { className: "container-fluid" },
            AppLogo ? React.createElement(AppLogo, null) : null,
            React.createElement("button", { className: "navbar-toggler", type: "button", "data-toggle": "collapse", "data-target": "#navbarSupportedContent", "aria-controls": "navbarSupportedContent", "aria-expanded": "false", "aria-label": "Toggle navigation" },
                React.createElement("span", { className: "navbar-toggler-icon" })),
            React.createElement("div", { className: "collapse navbar-collapse" },
                LeftExtensions ? React.createElement(LeftExtensions, null) : null,
                projectName !== null ? (React.createElement("ul", { className: "navbar-nav align-items-center" },
                    React.createElement("li", { className: "nav-item align-middle" },
                        React.createElement("p", { className: "m-0 h-100 text-white align-middle" }, "Some Project Name")))) : null,
                React.createElement("ul", { className: "navbar-nav ms-auto align-items-end" },
                    CustomerLogo ? React.createElement(CustomerLogo, null) : null,
                    VisynLogo ? React.createElement(VisynLogo, null) : null),
                React.createElement("ul", { className: "navbar-nav align-items-end" },
                    RightExtensions ? React.createElement(RightExtensions, null) : null,
                    SettingsMenu ? React.createElement(SettingsMenu, { menuItems: ConfigMenuOptions ? React.createElement(ConfigMenuOptions, null) : null }) : null)))));
}
//# sourceMappingURL=VisynHeader.js.map