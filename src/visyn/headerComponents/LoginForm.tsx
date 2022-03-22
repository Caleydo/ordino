import React from 'react';

export interface ILoginFormProps {
  onLogin: (username: string, password: string, rememberMe) => Promise<void>;
}
export function LoginForm({ onLogin }: ILoginFormProps) {
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
    <form className="form-signin" onSubmit={onSubmit}>
      <div className="mb-3">
        <label className="form-label" htmlFor="login_username">
          Username
        </label>
        <input type="text" className="form-control" id="login_username" name="username" placeholder="User name" required autoComplete="username" autoFocus />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="login_password">
          Password
        </label>
        <input type="text" className="form-control" id="login_password" name="password" placeholder="Password" required autoComplete="current-password" />
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
        <button className="btn btn-primary mt-2" type="submit">
          Login
        </button>
      </div>
    </form>
  );
}
