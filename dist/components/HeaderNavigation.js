import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { OrdinoLogo } from './OrdinoLogo';
export function HeaderNavigation({ links, fixed, bg = 'dark' }) {
    return (React.createElement("nav", { className: `ordino-header-navigation navbar navbar-expand-lg navbar-dark bg-${bg} ${fixed === 'top' ? 'fixed-top' : ''} ${fixed === 'bottom' ? 'fixed-bottom' : ''}` },
        React.createElement("a", { href: "#/", className: "navbar-brand" },
            React.createElement(OrdinoLogo, null)),
        React.createElement("a", { href: "/app/", className: "order-lg-2 mx-3 mx-lg-0 ml-auto ml-lg-3 btn btn-light" }, "Start Analysis"),
        React.createElement("button", { className: "navbar-toggler", type: "button", "data-toggle": "collapse", "data-target": "#ordino-header-navbar-nav", "aria-controls": "ordino-header-navbar-nav", "aria-expanded": "false", "aria-label": "Toggle navigation" },
            React.createElement("span", { className: "navbar-toggler-icon" })),
        React.createElement("div", { className: "order-lg-1 navbar-collapse collapse", id: "ordino-header-navbar-nav" }, links &&
            React.createElement("ul", { className: "navbar-nav" }, links.map(({ text, page }) => React.createElement("li", { className: "px-3 nav-item" },
                React.createElement(NavLink, { to: page, className: "nav-link", activeClassName: "active" }, text)))))));
}
//# sourceMappingURL=HeaderNavigation.js.map