import React from 'react';
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
    return (React.createElement("form", { className: "form-signin", onSubmit: onSubmit },
        React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label", htmlFor: "login_username" }, "Username"),
            React.createElement("input", { type: "text", className: "form-control", id: "login_username", name: "username", placeholder: "User name", required: true, autoComplete: "username", autoFocus: true })),
        React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label", htmlFor: "login_password" }, "Password"),
            React.createElement("input", { type: "text", className: "form-control", id: "login_password", name: "password", placeholder: "Password", required: true, autoComplete: "current-password" })),
        React.createElement("div", { className: "mb-3 form-check" },
            React.createElement("input", { type: "checkbox", className: "form-check-input", name: "rememberMe", value: "remember-me", id: "login_remember" }),
            React.createElement("label", { className: "form-check-label", htmlFor: "login_remember" }, "Remember me")),
        React.createElement("span", { className: "form-text text-muted" }, "A random username and password is generated for you. However, you can use the same username and password next time to continue your work. Your previous username and password are stored as a cookie for your convenience."),
        React.createElement("div", { className: "d-grid gap-2" },
            React.createElement("button", { className: "btn btn-primary mt-2", type: "submit" }, "Login"))));
}
//# sourceMappingURL=LoginForm.js.map