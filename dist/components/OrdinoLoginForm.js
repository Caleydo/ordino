import React from 'react';
import { AppContext, BaseUtils, useAsync } from 'tdp_core';
import { BusyOverlay } from '../visyn';
export function useGenerateRandomUser() {
    // generate random username
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)randomCredentials\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const getGeneratedUsername = () => AppContext.getInstance().getAPIJSON('/tdp/security_store_generated/generated_username');
    const getUser = React.useMemo(() => async () => {
        let username;
        let password;
        if (cookieValue) {
            // restore old value
            [username, password] = cookieValue.split('@');
        }
        else {
            // request new username and generate new password
            username = await getGeneratedUsername();
            password = BaseUtils.randomId(6);
        }
        return { username, password };
    }, [cookieValue]);
    const { status, value: user } = useAsync(getUser, []);
    React.useEffect(() => {
        if (status === 'success') {
            // store for next time
            const maxAge = 2 * 7 * 24 * 60 * 60; // 2 weeks in seconds
            document.cookie = `randomCredentials=${user.username}@${user.password};max-age=${maxAge};SameSite=Strict`;
        }
    }, [status, user]);
    return { status, user };
}
/**
 * phovea_security_store_generated
 * @param param0
 * @returns
 */
export function OrdinoLoginForm({ onLogin }) {
    const { status, user } = useGenerateRandomUser();
    return status === 'success' ? (React.createElement("form", { className: "form-signin", onSubmit: (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            const target = evt.target;
            const username = target.username.value;
            const password = target.password.value;
            const rememberMe = target.rememberMe.checked;
            onLogin(username, password, rememberMe);
        } },
        React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label", htmlFor: "login_username" }, "Username"),
            React.createElement("input", { type: "text", className: "form-control", id: "login_username", name: "username", defaultValue: user.username, placeholder: "User name", required: true, autoComplete: "username", autoFocus: true })),
        React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label", htmlFor: "login_password" }, "Password"),
            React.createElement("input", { type: "text", className: "form-control", id: "login_password", name: "password", defaultValue: user.password, placeholder: "Password", required: true, autoComplete: "current-password" })),
        React.createElement("div", { className: "mb-3 form-check" },
            React.createElement("input", { type: "checkbox", className: "form-check-input", name: "rememberMe", value: "remember-me", id: "login_remember" }),
            React.createElement("label", { className: "form-check-label", htmlFor: "login_remember" }, "Remember me")),
        React.createElement("span", { className: "form-text text-muted" }, "A random username and password is generated for you. However, you can use the same username and password next time to continue your work. Your previous username and password are stored as a cookie for your convenience."),
        React.createElement("div", { className: "d-grid gap-2" },
            React.createElement("button", { className: "btn btn-primary mt-2", "data-bs-dismiss": "modal", type: "submit" }, "Login")))) : (React.createElement(BusyOverlay, null));
}
//# sourceMappingURL=OrdinoLoginForm.js.map