import React from 'react';
import { GlobalEventHandler, UserSession } from 'tdp_core';

export function useLoggedInStatus() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    GlobalEventHandler.getInstance().on(UserSession.GLOBAL_EVENT_USER_LOGGED_IN, () => setLoggedIn(true));
    GlobalEventHandler.getInstance().on(UserSession.GLOBAL_EVENT_USER_LOGGED_OUT, () => setLoggedIn(false));

    return () => {
      GlobalEventHandler.getInstance().off(UserSession.GLOBAL_EVENT_USER_LOGGED_IN, () => setLoggedIn(true));
      GlobalEventHandler.getInstance().off(UserSession.GLOBAL_EVENT_USER_LOGGED_OUT, () => () => setLoggedIn(false));
    };
  }, []);

  return { loggedIn, userName: UserSession.getInstance().currentUserNameOrAnonymous() };
}
