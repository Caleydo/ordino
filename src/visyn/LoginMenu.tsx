import React, { ComponentType, useState } from 'react';
import { AppContext, GlobalEventHandler, I18nextManager, LoginUtils, SessionWatcher, useAsync, UserSession } from 'tdp_core';
import { useAppDispatch } from '../hooks';
import { IVisynLoginFormProps, LoginDialog, VisynLoginForm } from './headerComponents';
import { login, logout } from './usersSlice';

export interface ILoginLinkProps {
  userName?: string;
  onLogout: () => Promise<void>;
}

export function VisynLoginLink({ userName, onLogout }: ILoginLinkProps) {
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
  watch?: boolean;
  extensions?: {
    LoginForm?: ComponentType<IVisynLoginFormProps>;
  };
}

const loginMenuComponents = {
  LoginForm: VisynLoginForm,
};

export function VisynLoginMenu({ watch = false, extensions = {} }: ILoginMenuProps) {
  const { LoginForm } = { ...loginMenuComponents, ...extensions };
  const dispatch = useAppDispatch();
  const [loggedInAs, setLoggedInAs] = React.useState<string>(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string>(null);

  /**
   * auto login if (rememberMe=true)
   */
  const autoLogin = React.useMemo(
    () => async () => {
      return new Promise((resolve) => {
        if (!AppContext.getInstance().offline && !loggedInAs) {
          LoginUtils.loggedInAs()
            .then((user) => {
              UserSession.getInstance().login(user);
              resolve(null);
            })
            .catch(() => {
              // ignore not yet logged in
            });
        }
        resolve(null);
      });
    },
    [loggedInAs],
  );

  React.useEffect(() => {
    if (watch) {
      SessionWatcher.startWatching(LoginUtils.logout);
    }
  }, [watch]);

  React.useEffect(() => {
    let forceShowLoginDialogTimeout: any = -1;
    const loginListener = (_, user) => {
      setLoggedInAs(user.name);
      dispatch(login(user.name));
      setShow(false);
      clearTimeout(forceShowLoginDialogTimeout);
    };

    const logoutListener = () => {
      setLoggedInAs(null);
      dispatch(logout());
      setShow(true);
    };

    GlobalEventHandler.getInstance().on(UserSession.GLOBAL_EVENT_USER_LOGGED_IN, loginListener);
    GlobalEventHandler.getInstance().on(UserSession.GLOBAL_EVENT_USER_LOGGED_OUT, logoutListener);

    if (!loggedInAs) {
      // wait .5sec before showing the login dialog to give the auto login mechanism a chance
      forceShowLoginDialogTimeout = setTimeout(() => setShow(true), 500);
    }

    return () => {
      GlobalEventHandler.getInstance().off(UserSession.GLOBAL_EVENT_USER_LOGGED_IN, loginListener);
      GlobalEventHandler.getInstance().off(UserSession.GLOBAL_EVENT_USER_LOGGED_OUT, logoutListener);
    };
  }, [dispatch, loggedInAs]);

  useAsync(autoLogin, []);

  return (
    <ul className="navbar-nav align-items-end">
      <LoginDialog show={show} hasWarning={error === 'not_reachable'} hasError={error != null && error !== 'not_reachable'}>
        {(onHide) => {
          return (
            <>
              <div className="alert alert-warning" role="alert">
                {I18nextManager.getInstance().i18n.t('phovea:security_flask.alertOffline')}
              </div>
              <div className="alert alert-danger" role="alert">
                {I18nextManager.getInstance().i18n.t('phovea:security_flask.alertWrongCredentials')}
              </div>
              <LoginForm
                onLogin={async (username: string, password: string) => {
                  setError(null);
                  return LoginUtils.login(username, password)
                    .then(onHide)
                    .catch((e) => {
                      if (e.response && e.response.status !== 401) {
                        // 401 = Unauthorized
                        // server error
                        setError('not_reachable');
                      } else {
                        setError(e);
                      }
                    });
                }}
              />
            </>
          );
        }}
      </LoginDialog>
    </ul>
  );
}
