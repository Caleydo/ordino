import React from "react";
export const ConfigurationMenu = ({ extensions: { menuItems = null } }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement("ul", { className: "ms-2 navbar-right navbar-nav" },
            React.createElement("li", { className: "nav-item dropdown", id: "user_menu" },
                React.createElement("a", { href: "#", className: "nav-link dropdown-toggle", "data-bs-toggle": "dropdown", role: "button", "aria-haspopup": "true", id: "userMenuDropdown", "aria-expanded": "false" },
                    React.createElement("i", { className: "fas fa-ellipsis-v text-light" })),
                menuItems))));
};
//# sourceMappingURL=ConfigurationMenu.js.map