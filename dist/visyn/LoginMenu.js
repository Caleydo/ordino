import React from 'react';
import { LoginUtils, SessionWatcher } from 'tdp_core';
import { LoginDialog, LoginForm as DefaultLoginForm } from './headerComponents';
import { useAutoLogin } from './hooks/useAutoLogin';
export function LoginLink({ userName, onLogout }) {
    return (React.createElement("li", { className: "nav-item dropdown" },
        React.createElement("a", { href: "#", className: "nav-link", "data-bs-toggle": "dropdown", role: "button", "aria-haspopup": "true", id: "userMenuDropdown", "aria-expanded": "false" },
            React.createElement("i", { className: "fas fa-user", "aria-hidden": "true" }),
            " ",
            React.createElement("span", null, userName)),
        React.createElement("div", { className: "dropdown-menu dropdown-menu-end", "data-bs-popper": "none", "aria-labelledby": "userMenuDropdown" },
            React.createElement("a", { className: "dropdown-item", href: "#", onClick: onLogout }, "Logout"))));
}
const loginMenuComponents = {
    LoginForm: DefaultLoginForm,
};
export function LoginMenu({ onLogout, watch, extensions = {} }) {
    const { LoginForm } = { ...loginMenuComponents, ...extensions };
    const { loggedIn, status } = useAutoLogin();
    React.useEffect(() => {
        if (watch) {
            SessionWatcher.startWatching(onLogout);
        }
    }, [onLogout, watch]);
    return (React.createElement("ul", { className: "navbar-nav align-items-end" },
        React.createElement(LoginDialog, { show: !loggedIn && status === 'success' }, (onHide) => (React.createElement(LoginForm, { onLogin: (username, password, rememberMe) => LoginUtils.login(username, password, rememberMe).then(onHide) })))));
}
//# sourceMappingURL=LoginMenu.js.map