import React, { ComponentType } from 'react';
import { LoginUtils, SessionWatcher } from 'tdp_core';
import { ILoginFormProps, LoginDialog, LoginForm as DefaultLoginForm } from './headerComponents';
import { useAutoLogin } from './hooks/useAutoLogin';

export interface ILoginLinkProps {
  userName?: string;
  onLogout: () => Promise<void>;
}

export function LoginLink({ userName, onLogout }: ILoginLinkProps) {
  return (
    <li className="nav-item dropdown">
      <a href="#" className="nav-link" data-bs-toggle="dropdown" role="button" aria-haspopup="true" id="userMenuDropdown" aria-expanded="false">
        <i className="fas fa-user" aria-hidden="true" /> <span>{userName}</span>
      </a>
      <div className="dropdown-menu dropdown-menu-end" data-bs-popper="none" aria-labelledby="userMenuDropdown">
        <a className="dropdown-item" href="#" onClick={onLogout}>
          Logout
        </a>
      </div>
    </li>
  );
}

export interface ILoginMenuProps {
  onLogout: () => Promise<any>;
  watch?: boolean;
  extensions?: {
    LoginForm?: ComponentType<ILoginFormProps>;
  };
}

const loginMenuComponents = {
  LoginForm: DefaultLoginForm,
};

export function LoginMenu({ onLogout, watch, extensions = {} }: ILoginMenuProps) {
  const { LoginForm } = { ...loginMenuComponents, ...extensions };
  const { loggedIn, status } = useAutoLogin();

  React.useEffect(() => {
    if (watch) {
      SessionWatcher.startWatching(onLogout);
    }
  }, [onLogout, watch]);

  return (
    <ul className="navbar-nav align-items-end">
      <LoginDialog show={!loggedIn && status === 'success'}>
        {(onHide) => (
          <LoginForm onLogin={(username: string, password: string, rememberMe: boolean) => LoginUtils.login(username, password, rememberMe).then(onHide)} />
        )}
      </LoginDialog>
    </ul>
  );
}
