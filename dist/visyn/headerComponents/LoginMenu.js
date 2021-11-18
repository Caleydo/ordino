import React from 'react';
export function LoginMenu({ username = 'admin' }) {
    return React.createElement("li", { className: "nav-item dropdown", id: "user_menu" },
        React.createElement("a", { href: "#", className: "nav-link", "data-bs-toggle": "dropdown", role: "button", "aria-haspopup": "true", id: "userMenuDropdown", "aria-expanded": "false" },
            React.createElement("i", { className: "fas fa-user", "aria-hidden": "true" }),
            React.createElement("span", { className: "ms-1" }, "jovial_banach")),
        React.createElement("div", { className: "dropdown-menu dropdown-menu-end", "aria-labelledby": "userMenuDropdown" },
            React.createElement("a", { className: "dropdown-item", href: "#", id: "logout_link" }, "Logout")));
}
//# sourceMappingURL=LoginMenu.js.map