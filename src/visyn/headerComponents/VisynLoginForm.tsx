import React from 'react';
import { I18nextManager } from 'tdp_core';

export interface IVisynLoginFormProps {
  onLogin: (username: string, password: string, rememberMe) => Promise<void>;
}
export function VisynLoginForm({ onLogin }: IVisynLoginFormProps) {
  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    const target = evt.target as typeof evt.target & {
      username: { value: string };
      password: { value: string };
      rememberMe: { checked: boolean };
    };
    const username = target.username.value;
    const password = target.password.value;
    const rememberMe = target.rememberMe.checked;
    onLogin(username, password, rememberMe);
  };

  return (
    <form className="form-signin" action="/login" method="post" onSubmit={onSubmit}>
      <div className="mb-3">
        <label className="form-label" htmlFor="login_username">
          ${I18nextManager.getInstance().i18n.t('phovea:security_flask.username')}
        </label>
        <input
          type="text"
          className="form-control"
          id="login_username"
          placeholder={I18nextManager.getInstance().i18n.t('phovea:security_flask.username')}
          required
          autoFocus
          autoComplete="username"
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="login_password">
          {' '}
          ${I18nextManager.getInstance().i18n.t('phovea:security_flask.password')}
        </label>
        <input
          type="password"
          className="form-control"
          id="login_password"
          placeholder={I18nextManager.getInstance().i18n.t('phovea:security_flask.password')}
          required
          autoComplete="current-password"
        />
      </div>
      <div className="mb-3">
        <div className="checkbox form-check">
          <input type="checkbox" className="form-check-input" id="login_remember" />
          <label className="form-label form-check-label" htmlFor="login_remember">
            ${I18nextManager.getInstance().i18n.t('phovea:security_flask.rememberMe')}
          </label>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        {' '}
        ${I18nextManager.getInstance().i18n.t('phovea:security_flask.submit')}
      </button>
    </form>
  );
}
