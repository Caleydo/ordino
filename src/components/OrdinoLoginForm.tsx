import React from 'react';
import { AppContext, BaseUtils, useAsync } from 'tdp_core';
import { BusyOverlay } from '../visyn';

export function useGenerateRandomUser() {
  // generate random username
  const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)randomCredentials\s*=\s*([^;]*).*$)|^.*$/, '$1');
  const getGeneratedUsername = (): Promise<string> => AppContext.getInstance().getAPIJSON('/tdp/security_store_generated/generated_username');
  const getUser = React.useMemo(
    () => async () => {
      let username: string;
      let password: string;
      if (cookieValue) {
        // restore old value
        [username, password] = cookieValue.split('@');
      } else {
        // request new username and generate new password
        username = await getGeneratedUsername();
        password = BaseUtils.randomId(6);
      }
      return { username, password };
    },
    [cookieValue],
  );

  const { status, value: user } = useAsync(getUser, []);

  React.useEffect(() => {
    if (status === 'success') {
      // store for next time
      const maxAge = 2 * 7 * 24 * 60 * 60; // 2 weeks in seconds
      document.cookie = `randomCredentials=${user.username}@${user.password};max-age=${maxAge};SameSite=Strict`;
    }
  }, [status, user]);
  return { status, user };
}

export interface IOrdinoLoginFormProps {
  onLogin: (username: string, password: string, rememberMe: boolean) => Promise<void>;
}

/**
 * phovea_security_store_generated
 * @param param0
 * @returns
 */
export function OrdinoLoginForm({ onLogin }: IOrdinoLoginFormProps) {
  const { status, user } = useGenerateRandomUser();

  return status === 'success' ? (
    <form
      className="form-signin"
      onSubmit={(evt) => {
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
      }}
    >
      <div className="mb-3">
        <label className="form-label" htmlFor="login_username">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="login_username"
          name="username"
          defaultValue={user.username}
          placeholder="User name"
          required
          autoComplete="username"
          autoFocus
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="login_password">
          Password
        </label>
        <input
          type="text"
          className="form-control"
          id="login_password"
          name="password"
          defaultValue={user.password}
          placeholder="Password"
          required
          autoComplete="current-password"
        />
      </div>

      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" name="rememberMe" value="remember-me" id="login_remember" />
        <label className="form-check-label" htmlFor="login_remember">
          Remember me
        </label>
      </div>
      <span className="form-text text-muted">
        A random username and password is generated for you. However, you can use the same username and password next time to continue your work. Your previous
        username and password are stored as a cookie for your convenience.
      </span>
      <div className="d-grid gap-2">
        <button className="btn btn-primary mt-2" data-bs-dismiss="modal" type="submit">
          Login
        </button>
      </div>
    </form>
  ) : (
    <BusyOverlay />
  );
}
