import React from 'react';
import { AppContext, LoginUtils, useAsync, UserSession } from 'tdp_core';
import { useAppDispatch } from '../..';
import { login, logout } from '../usersSlice';
import { useLoggedInStatus } from './useLoginStatus';
/**
 *
 */
export function useAutoLogin() {
    const { loggedIn, userName } = useLoggedInStatus();
    const dispatch = useAppDispatch();
    const attemptAutoLogin = React.useMemo(() => () => {
        return new Promise((resolve) => {
            if (!AppContext.getInstance().offline && !loggedIn) {
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
    }, [loggedIn]);
    React.useEffect(() => {
        if (loggedIn) {
            dispatch(login(userName));
        }
        else {
            dispatch(logout());
        }
    }, [loggedIn]);
    const { status } = useAsync(attemptAutoLogin, []);
    return { loggedIn, userName, status };
}
//# sourceMappingURL=useAutoLogin.js.map