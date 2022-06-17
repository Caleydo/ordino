import * as React from 'react';
export function WarningMessage({ warning }) {
    return warning ? (React.createElement("div", { className: "alert alert-warning flex-fill d-flex align-items-center", role: "alert" },
        React.createElement("i", { className: "fas fa-fw fa-exclamation" }),
        React.createElement("div", { className: "flex-fill" }, warning.toString()))) : null;
}
//# sourceMappingURL=WarningMessage.js.map