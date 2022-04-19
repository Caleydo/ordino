import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as icon from '../assets/logos/ordino.svg';
export function create(loginMenu, loginDialog) {
    const bodyNode = loginDialog.querySelector('.modal-body');
    const formNode = bodyNode.querySelector('form');
    const headerNode = loginDialog.querySelector('.modal-title');
    headerNode.innerText = `Login to Ordino`;
    const node = document.createElement('div');
    bodyNode.appendChild(node);
    formNode.style.display = 'none';
    ReactDOM.render(React.createElement("div", { style: { minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
        React.createElement("img", { src: icon, style: { width: '60px', marginBottom: '2em' } }),
        "You will be automatically logged into Ordino as soon as you visit the site. If your access is expired, please refresh the page to log in again."), node);
}
//# sourceMappingURL=SecurityCookieStoreLoginDialog.js.map