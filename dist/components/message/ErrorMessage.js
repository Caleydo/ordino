import * as React from 'react';
import { I18nextManager } from 'tdp_core';
export function ErrorMessage({ error, onRetry }) {
    return error ? (React.createElement("div", { className: "alert alert-danger flex-fill d-flex align-items-center", role: "alert" },
        React.createElement("i", { className: "fas fa-fw fa-exclamation" }),
        React.createElement("div", { className: "flex-fill" }, error instanceof Response ? error.statusText : error.toString()),
        onRetry ? (React.createElement("button", { type: "button", className: "btn btn-sm btn-outline-danger", onClick: onRetry }, I18nextManager.getInstance().i18n.t('tdp:ordino.message.retry'))) : null)) : null;
}
//# sourceMappingURL=ErrorMessage.js.map