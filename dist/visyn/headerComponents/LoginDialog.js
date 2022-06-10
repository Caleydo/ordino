import React, { useCallback, useEffect, useRef } from 'react';
import { I18nextManager, useBSModal } from 'tdp_core';
/**
 * Basic login dialog
 */
export function LoginDialog({ show = false, title = I18nextManager.getInstance().i18n.t('phovea:security_flask.title'), children, hasWarning, hasError, }) {
    const [ref, instance] = useBSModal();
    const modalRef = useRef(null);
    React.useEffect(() => {
        if (instance && show) {
            instance.show();
        }
    }, [instance, show]);
    useEffect(() => {
        modalRef.current.classList.toggle('has-warning', hasWarning);
        modalRef.current.classList.toggle('has-error', hasError);
    }, [hasWarning, hasError]);
    const setRef = useCallback((element) => {
        modalRef.current = element;
        ref(element);
    }, [ref]);
    return (React.createElement("div", { ref: setRef, className: "modal fade", id: "loginDialog", tabIndex: -1, role: "dialog", "aria-labelledby": "loginDialog", "data-bs-keyboard": "false", "data-bs-backdrop": "static" },
        React.createElement("div", { className: "modal-dialog modal-sm" },
            React.createElement("div", { className: "modal-content" },
                React.createElement("div", { className: "modal-header" },
                    React.createElement("h5", { className: "modal-title" }, title)),
                React.createElement("div", { className: "modal-body" }, children(() => instance.hide()))))));
}
//# sourceMappingURL=LoginDialog.js.map