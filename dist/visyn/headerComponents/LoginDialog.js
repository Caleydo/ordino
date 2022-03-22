import React from 'react';
import { useBSModal } from 'tdp_core';
import { ModalDialog } from './ModalDialog';
/**
 * Basic login dialog
 */
export function LoginDialog({ show = false, title = 'Please Login', children }) {
    const [ref, instance] = useBSModal();
    React.useEffect(() => {
        if (instance && show) {
            instance.show();
        }
    }, [instance, show]);
    return (React.createElement(ModalDialog, { ref: ref, title: title, enableCloseButton: false }, children(() => instance.hide())));
}
//# sourceMappingURL=LoginDialog.js.map