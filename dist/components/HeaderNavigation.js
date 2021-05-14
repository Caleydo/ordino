import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { OrdinoLogo } from './OrdinoLogo';
export function HeaderNavigation(props) {
    var _a;
    const bg = (_a = props.bg) !== null && _a !== void 0 ? _a : 'ordino-gray-2';
    return (React.createElement("nav", { className: `ordino-header-navigation navbar navbar-expand-lg navbar-dark bg-${bg} ${props.fixed === 'top' ? 'fixed-top' : ''} ${props.fixed === 'bottom' ? 'fixed-bottom' : ''}` },
        React.createElement("a", { href: "#/", className: "navbar-brand" },
            React.createElement(OrdinoLogo, null)),
        React.createElement("a", { href: "/app/", className: "order-lg-2 mx-3 mx-lg-0 ml-auto ml-lg-3 btn btn-light" }, "Start Analysis"),
        React.createElement("button", { className: "navbar-toggler", type: "button", "data-toggle": "collapse", "data-target": "#ordino-header-navbar-nav", "aria-controls": "ordino-header-navbar-nav", "aria-expanded": "false", "aria-label": "Toggle navigation" },
            React.createElement("span", { className: "navbar-toggler-icon" })),
        React.createElement("div", { className: "order-lg-1 navbar-collapse collapse", id: "ordino-header-navbar-nav" },
            React.createElement("ul", { className: "navbar-nav" },
                React.createElement("li", { className: "px-3 nav-item" },
                    React.createElement(NavLink, { to: "/news", className: "nav-link", activeClassName: "active" }, "What's new?")),
                React.createElement("li", { className: "px-3 nav-item" },
                    React.createElement(NavLink, { to: "/features", className: "nav-link", activeClassName: "active" }, "Features")),
                React.createElement("li", { className: "px-3 nav-item" },
                    React.createElement(NavLink, { to: "/datasets", className: "nav-link", activeClassName: "active" }, "Datasets"))))));
}
//# sourceMappingURL=HeaderNavigation.js.map