import React from 'react';
import { I18nextManager } from 'tdp_core';
export function VisynLoginForm({ onLogin }) {
    const onSubmit = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        const target = evt.target;
        const username = target.username.value;
        const password = target.password.value;
        const rememberMe = target.rememberMe.checked;
        onLogin(username, password, rememberMe);
    };
    return (React.createElement("form", { className: "form-signin", action: "/login", method: "post", onSubmit: onSubmit },
        React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label", htmlFor: "login_username" },
                "$",
                I18nextManager.getInstance().i18n.t('phovea:security_flask.username')),
            React.createElement("input", { type: "text", className: "form-control", id: "login_username", placeholder: I18nextManager.getInstance().i18n.t('phovea:security_flask.username'), required: true, autoFocus: true, autoComplete: "username" })),
        React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label", htmlFor: "login_password" },
                ' ',
                "$",
                I18nextManager.getInstance().i18n.t('phovea:security_flask.password')),
            React.createElement("input", { type: "password", className: "form-control", id: "login_password", placeholder: I18nextManager.getInstance().i18n.t('phovea:security_flask.password'), required: true, autoComplete: "current-password" })),
        React.createElement("button", { type: "submit", className: "btn btn-primary" },
            ' ',
            "$",
            I18nextManager.getInstance().i18n.t('phovea:security_flask.submit'))));
}
//# sourceMappingURL=VisynLoginForm.js.map