import React from 'react';
import { useBSModal } from 'tdp_core';
export function LoginDialog(props) {
    const [ref, instance] = useBSModal();
    React.useEffect(() => {
        if (props.autoShow && instance) {
            instance.show();
        }
        console.log(ref);
    }, [ref, props.autoShow, instance]);
    return React.createElement("div", { ref: ref, className: "modal fade", id: "staticBackdrop", "data-bs-backdrop": "static", "data-bs-keyboard": "false", tabIndex: -1, "aria-labelledby": "staticBackdropLabel", "aria-hidden": "true" },
        React.createElement("div", { className: "modal-dialog modal-sm" },
            React.createElement("div", { className: "modal-content" },
                React.createElement("div", { className: "modal-header" },
                    React.createElement("h5", { className: "modal-title" }, "Please login"),
                    React.createElement("button", { type: "button", className: "btn-close", "data-bs-dismiss": "modal", "aria-label": "Close", hidden: true })),
                React.createElement("div", { className: "modal-body" },
                    React.createElement("div", { className: "alert alert-warning", role: "alert" }, "The server seems to be offline! Login not possible. Try again later."),
                    React.createElement("div", { className: "alert alert-danger", role: "alert" }, "Username or password incorrect. Please check again."),
                    React.createElement("form", { className: "form-signin", action: "/login", method: "post" },
                        React.createElement("div", { className: "mb-3" },
                            React.createElement("label", { className: "form-label", htmlFor: "login_username" }, "Username"),
                            React.createElement("input", { type: "text", className: "form-control", id: "login_username", placeholder: "User name", required: true, autoComplete: "username", autoFocus: true })),
                        React.createElement("div", { className: "mb-3" },
                            React.createElement("label", { className: "form-label", htmlFor: "login_password" }, "Password"),
                            React.createElement("input", { type: "text", className: "form-control", id: "login_password", placeholder: "Password", required: true, autoComplete: "current-password" })),
                        React.createElement("div", { className: "mb-3 form-check" },
                            React.createElement("input", { type: "checkbox", className: "form-check-input", value: "remember-me", id: "login_remember" }),
                            React.createElement("label", { className: "form-check-label", htmlFor: "login_remember" }, "Remember me")),
                        React.createElement("span", { className: "form-text text-muted" }, "A random username and password is generated for you. However, you can use the same username and password next time to continue your work. Your previous username and password are stored as a cookie for your convenience."),
                        React.createElement("div", { className: "d-grid gap-2" },
                            React.createElement("button", { className: "btn btn-primary mt-2", onClick: () => props.onSubmit(instance) }, "Login")))))));
}
//# sourceMappingURL=LoginDialog.js.map