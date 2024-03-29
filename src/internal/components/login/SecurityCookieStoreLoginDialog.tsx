import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextManager } from 'visyn_core/i18n';

function SecurityCookieStoreLoginDialog() {
  return (
    <div style={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {I18nextManager.getInstance().i18n.t('tdp:ordino.loginMenu.automaticLoginDisclaimer')}
      <button className="btn btn-outline-secondary btn-sm mt-2" type="button" onClick={() => window.location.reload()}>
        {I18nextManager.getInstance().i18n.t('tdp:ordino.loginMenu.refreshPage')}
      </button>
    </div>
  );
}

export function create(loginMenu: HTMLElement, loginDialog: HTMLElement) {
  const bodyNode = loginDialog.querySelector('.modal-body');
  const formNode = bodyNode.querySelector('form') as HTMLFormElement;
  const headerNode = loginDialog.querySelector('.modal-title') as HTMLElement;
  headerNode.innerText = I18nextManager.getInstance().i18n.t('tdp:ordino.loginMenu.modalTitle');
  const node = document.createElement('div');
  bodyNode.appendChild(node);
  formNode.style.display = 'none';

  createRoot(node).render(<SecurityCookieStoreLoginDialog />);
}
