import React from 'react';
export function SettingsMenu({ menuItems = null }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("li", { className: "nav-item dropdown", id: "user_menu" },
            React.createElement("a", { href: "#", className: "nav-link", "data-bs-toggle": "dropdown", role: "button", "aria-haspopup": "true", id: "userMenuDropdown", "aria-expanded": "false" },
                React.createElement("i", { className: "fas fa-ellipsis-v text-light" })),
            React.createElement("ul", { className: "dropdown-menu dropdown-menu-end", "aria-labelledby": "userMenuDropdown" },
                React.createElement("button", { className: "dropdown-item" }, "About"),
                React.createElement("button", { className: "dropdown-item" }, "Contact"),
                React.createElement("button", { className: "dropdown-item" }, "More")))));
}
//# sourceMappingURL=SettingsMenu.js.map