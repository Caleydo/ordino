import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as icon from '../assets/logos/ordino.svg';

export function create(loginMenu: HTMLElement, loginDialog: HTMLElement) {
  const bodyNode = loginDialog.querySelector('.modal-body');
  const formNode = bodyNode.querySelector('form') as HTMLFormElement;
  const headerNode = loginDialog.querySelector('.modal-title') as HTMLElement;
  headerNode.innerText = `Login to Ordino`;
  const node = document.createElement('div');
  bodyNode.appendChild(node);
  formNode.style.display = 'none';
  ReactDOM.render(
    <div style={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <img src={icon} style={{ width: '60px', marginBottom: '2em' }} />
      You will be automatically logged into Ordino as soon as you visit the site. If your access is expired, please refresh the page to log in again.
    </div>,
    node,
  );
}
