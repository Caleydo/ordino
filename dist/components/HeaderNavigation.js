import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { OrdinoLogo } from './OrdinoLogo';
import { PluginRegistry } from 'phovea_core';
import { EP_ORDINO_HEADER_MENU } from '../base';
export function HeaderNavigation({ fixed, bg = 'dark' }) {
    const links = PluginRegistry.getInstance().listPlugins(EP_ORDINO_HEADER_MENU)
        .map((d) => d) // no need to load the plugin; everything is contained in the plugin desc
        .map((d) => d.links)[0]; // take only the first footer menu
    return (React.createElement("nav", { className: `ordino-header-navigation navbar navbar-expand-lg navbar-dark bg-${bg} ${fixed === 'top' ? 'fixed-top' : ''} ${fixed === 'bottom' ? 'fixed-bottom' : ''}` },
        React.createElement("div", { className: "container-fluid" },
            React.createElement("a", { href: "#/", className: "navbar-brand" },
                React.createElement(OrdinoLogo, null)),
            React.createElement("a", { href: "/app/", className: "order-2 mx-3 mx-lg-0 ms-auto ms-lg-3 btn btn-light" }, "Start Analysis"),
            React.createElement("button", { className: "navbar-toggler", type: "button", "data-bs-toggle": "collapse", "data-bs-target": "#ordino-header-navbar-nav", "aria-controls": "ordino-header-navbar-nav", "aria-expanded": "false", "aria-label": "Toggle navigation" },
                React.createElement("span", { className: "navbar-toggler-icon" })),
            React.createElement("div", { className: "order-1 navbar-collapse collapse", id: "ordino-header-navbar-nav" }, links &&
                React.createElement("ul", { className: "navbar-nav" }, links.map(({ text, page, faIcon }, i) => React.createElement("li", { className: "px-3 nav-item", key: i },
                    React.createElement(NavLink, { to: page, className: "nav-link", activeClassName: "active" },
                        faIcon && (React.createElement("i", { className: `${faIcon} me-2` })),
                        text))))))));
}
//# sourceMappingURL=HeaderNavigation.js.map