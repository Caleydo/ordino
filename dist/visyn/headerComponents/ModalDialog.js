import React from 'react';
// eslint-disable-next-line react/display-name
export const ModalDialog = React.forwardRef(({ children, title = '', enableCloseButton = true }, ref) => {
    return (React.createElement("div", { ref: ref, className: "modal fade", id: "loginDialog", tabIndex: -1, role: "dialog", "aria-labelledby": "loginDialog", "data-keyboard": "false", "data-bs-backdrop": "static" },
        React.createElement("div", { className: "modal-dialog modal-sm" },
            React.createElement("div", { className: "modal-content" },
                React.createElement("div", { className: "modal-header" },
                    React.createElement("h5", { className: "modal-title" }, title),
                    enableCloseButton ? React.createElement("button", { type: "button", className: "btn-close", "data-bs-dismiss": "modal", "aria-label": "Close" }) : null),
                React.createElement("div", { className: "modal-body" }, children)))));
});
//# sourceMappingURL=ModalDialog.js.map