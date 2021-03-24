import * as React from 'react';
import { Navbar, Button, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { OrdinoLogo } from './OrdinoLogo';
export function HeaderNavigation(props) {
    var _a;
    const bg = (_a = props.bg) !== null && _a !== void 0 ? _a : 'ordino-gray-2';
    return (React.createElement(Navbar, { collapseOnSelect: true, fixed: props.fixed, expand: "lg", bg: bg, variant: "dark", className: "ordino-header-navigation" },
        React.createElement(Navbar.Brand, { href: "#/" },
            React.createElement(OrdinoLogo, null)),
        React.createElement(Button, { href: "/app/", variant: "light", className: "order-lg-2 mx-3 mx-lg-0 ml-auto ml-lg-3" }, "Start Analysis"),
        React.createElement(Navbar.Toggle, { "aria-controls": "ordino-header-navbar-nav", className: "" }),
        React.createElement(Navbar.Collapse, { id: "ordino-header-navbar-nav", className: "order-lg-1" },
            React.createElement(Nav, { as: "ul" },
                React.createElement(Nav.Item, { as: "li", className: "px-3" },
                    React.createElement(NavLink, { to: "/news", className: "nav-link", activeClassName: "active" }, "What's new?")),
                React.createElement(Nav.Item, { as: "li", className: "px-3" },
                    React.createElement(NavLink, { to: "/features", className: "nav-link", activeClassName: "active" }, "Features")),
                React.createElement(Nav.Item, { as: "li", className: "px-3" },
                    React.createElement(NavLink, { to: "/datasets", className: "nav-link", activeClassName: "active" }, "Datasets"))))));
}
//# sourceMappingURL=HeaderNavigation.js.map