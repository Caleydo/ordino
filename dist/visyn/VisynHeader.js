import React from 'react';
import { I18nextManager } from 'tdp_core';
import { useAppSelector } from '../hooks';
import { visynHeaderComponents } from './headerConfig';
export function VisynHeader({ ConfigMenuOptions = null, BurgerSidebar = null, extensions = {}, burgerMenuEnabled = false }) {
    const { AppLogo, VisynLogo, CustomerLogo, BurgerButton, LeftExtensions, RightExtensions, SettingsMenu } = { ...visynHeaderComponents, ...extensions };
    const projectName = useAppSelector((state) => { var _a; return (_a = state.menu.currentProject) === null || _a === void 0 ? void 0 : _a.name; });
    const currentTab = useAppSelector((state) => state.menu.activeTab);
    return (React.createElement("nav", { className: " visyn-navbar navbar navbar-expand-lg navbar-dark bg-dark" },
        React.createElement("div", { className: "container-fluid" },
            AppLogo ? React.createElement(AppLogo, null) : null,
            React.createElement("button", { className: "navbar-toggler", type: "button", "data-toggle": "collapse", "data-target": "#navbarSupportedContent", "aria-controls": "navbarSupportedContent", "aria-expanded": "false", "aria-label": "Toggle navigation" },
                React.createElement("span", { className: "navbar-toggler-icon" })),
            React.createElement("div", { className: "collapse navbar-collapse" },
                LeftExtensions ? React.createElement(LeftExtensions, null) : null,
                projectName && currentTab !== 'datasets_tab' ? (React.createElement("ul", { className: "navbar-nav align-items-center" },
                    React.createElement("li", { className: "nav-item align-middle" },
                        React.createElement("p", { className: "m-0 h-100 text-white align-middle" },
                            React.createElement("i", { className: "fas fa-check me-2" }),
                            I18nextManager.getInstance().i18n.t('tdp:ordino.header.projectName', { projectName }))))) : null,
                React.createElement("ul", { className: "navbar-nav ms-auto align-items-end" },
                    CustomerLogo ? React.createElement(CustomerLogo, null) : null,
                    VisynLogo ? React.createElement(VisynLogo, null) : null),
                React.createElement("ul", { className: "navbar-nav align-items-end" },
                    RightExtensions ? React.createElement(RightExtensions, null) : null,
                    SettingsMenu ? React.createElement(SettingsMenu, { menuItems: ConfigMenuOptions ? React.createElement(ConfigMenuOptions, null) : null }) : null)))));
}
//# sourceMappingURL=VisynHeader.js.map