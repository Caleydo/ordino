import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextManager } from 'tdp_core';
import { useOrdinoLogo } from '../../../hooks/useOrdinoLogo';
function SecurityCookieStoreLoginDialog() {
    const { status, value } = useOrdinoLogo();
    return (React.createElement("div", { style: { minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
        status === 'success' && React.createElement("img", { src: value.icon, style: { width: '60px', marginBottom: '2em' }, alt: value.text }),
        I18nextManager.getInstance().i18n.t('tdp:ordino.loginMenu.automaticLoginDisclaimer'),
        React.createElement("button", { className: "btn btn-outline-secondary btn-sm mt-2", type: "button", onClick: () => window.location.reload() }, I18nextManager.getInstance().i18n.t('tdp:ordino.loginMenu.refreshPage'))));
}
export function create(loginMenu, loginDialog) {
    const bodyNode = loginDialog.querySelector('.modal-body');
    const formNode = bodyNode.querySelector('form');
    const headerNode = loginDialog.querySelector('.modal-title');
    headerNode.innerText = I18nextManager.getInstance().i18n.t('tdp:ordino.loginMenu.modalTitle');
    const node = document.createElement('div');
    bodyNode.appendChild(node);
    formNode.style.display = 'none';
    ReactDOM.render(React.createElement(SecurityCookieStoreLoginDialog, null), node);
}
//# sourceMappingURL=SecurityCookieStoreLoginDialog.js.map