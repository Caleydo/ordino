import React, { useState } from 'react';
import { AppContext, GlobalEventHandler, LoginUtils, SessionWatcher, useAsync, UserSession } from 'tdp_core';
import { useAppDispatch } from '../hooks';
import { LoginDialog, VisynLoginForm } from './headerComponents';
import { login, logout } from './usersSlice';
export function VisynLoginLink({ userName, onLogout }) {
    return (React.createElement("li", { className: "nav-item dropdown" },
        React.createElement("a", { href: "#", className: "nav-link", "data-bs-toggle": "dropdown", role: "button", "aria-haspopup": "true", id: "userMenuDropdown", "aria-expanded": "false" },
            React.createElement("i", { className: "fas fa-user", "aria-hidden": "true" }),
            " ",
            React.createElement("span", null, userName)),
        React.createElement("div", { className: "dropdown-menu dropdown-menu-end", "data-bs-popper": "none", "aria-labelledby": "userMenuDropdown" },
            React.createElement("a", { className: "dropdown-item", href: "#", onClick: onLogout }, "Logout"))));
}
const loginMenuComponents = {
    LoginForm: VisynLoginForm,
};
// TODO: Show dialog wanring / errors when there is an error(when we have a proper react dialog implementation)
export function VisynLoginMenu({ watch = false, extensions = {} }) {
    const { LoginForm } = { ...loginMenuComponents, ...extensions };
    const dispatch = useAppDispatch();
    const [loggedInAs, setLoggedInAs] = React.useState(null);
    const [show, setShow] = useState(false);
    /**
     * auto login if (rememberMe=true)
     */
    const autoLogin = React.useMemo(() => async () => {
        return new Promise((resolve) => {
            if (!AppContext.getInstance().offline && !loggedInAs) {
                LoginUtils.loggedInAs()
                    .then((user) => {
                    UserSession.getInstance().login(user);
                    resolve(null);
                })
                    .catch(() => {
                    // ignore not yet logged in
                });
            }
            resolve(null);
        });
    }, [loggedInAs]);
    React.useEffect(() => {
        if (watch) {
            SessionWatcher.startWatching(LoginUtils.logout);
        }
    }, [watch]);
    React.useEffect(() => {
        let forceShowLoginDialogTimeout = -1;
        const loginListener = (_, user) => {
            setLoggedInAs(user.name);
            dispatch(login(user.name));
            setShow(false);
            clearTimeout(forceShowLoginDialogTimeout);
        };
        const logoutListener = () => {
            setLoggedInAs(null);
            dispatch(logout());
            setShow(true);
        };
        GlobalEventHandler.getInstance().on(UserSession.GLOBAL_EVENT_USER_LOGGED_IN, loginListener);
        GlobalEventHandler.getInstance().on(UserSession.GLOBAL_EVENT_USER_LOGGED_OUT, logoutListener);
        if (!loggedInAs) {
            // wait .5sec before showing the login dialog to give the auto login mechanism a chance
            forceShowLoginDialogTimeout = setTimeout(() => setShow(true), 500);
        }
        return () => {
            GlobalEventHandler.getInstance().off(UserSession.GLOBAL_EVENT_USER_LOGGED_IN, loginListener);
            GlobalEventHandler.getInstance().off(UserSession.GLOBAL_EVENT_USER_LOGGED_OUT, logoutListener);
        };
    }, [dispatch, loggedInAs]);
    useAsync(autoLogin, []);
    return (React.createElement("ul", { className: "navbar-nav align-items-end" },
        React.createElement(LoginDialog, { show: show }, (onHide) => {
            return (React.createElement(LoginForm, { onLogin: async (username, password, rememberMe) => {
                    await LoginUtils.login(username, password, rememberMe);
                    onHide();
                } }));
        })));
}
//# sourceMappingURL=LoginMenu.js.map