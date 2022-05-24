import React, { useRef } from 'react';
import { I18nextManager } from 'tdp_core';

export interface IVisynLoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
}
export function VisynLoginForm({ onLogin }: IVisynLoginFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form className="form-signin" action="/login" method="post">
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
      <button
        type="submit"
        className="btn btn-primary"
        onClick={(evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          const formData = new FormData(formRef.current);
          onLogin(formData.get('username') as string, formData.get('password') as string);
        }}
      >
        {' '}
        ${I18nextManager.getInstance().i18n.t('phovea:security_flask.submit')}
      </button>
    </form>
  );
}
