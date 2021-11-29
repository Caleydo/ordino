import React from 'react';
import { PHOVEA_SECURITY_FLASK_LoginMenu as LoginMenu } from 'tdp_core';
import { login, logout, useAppDispatch, useAppSelector } from '../..';
import { HeaderAdapter } from './HeaderAdapter';
export function useLoginMenu() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const [instance, setInstance] = React.useState(null);
    const container = React.useRef(null);
    const [loggedIn, setLoggedIn] = React.useState(user.loggedIn);
    const setRef = React.useCallback((ref) => {
        setInstance((currentInstance) => {
            // If the element ref did not change, do nothing.
            if (currentInstance && ref) {
                return currentInstance;
            }
            // Create a new one if there is a ref
            if (ref) {
                const adapter = new HeaderAdapter();
                container.current = ref;
                const menu = new LoginMenu(adapter, { watch: true });
                return menu;
            }
            // Set instance to null if no ref is passed
            return null;
        });
    }, []);
    React.useEffect(() => {
        if (instance === null || instance === void 0 ? void 0 : instance.node) {
            container.current.appendChild(instance.node);
        }
    }, [container, instance]);
    React.useEffect(() => {
        if (instance) {
            instance.on(LoginMenu.EVENT_LOGGED_OUT, () => {
                dispatch(logout());
                setLoggedIn(false);
                instance.forceShowDialog();
            });
            instance.on(LoginMenu.EVENT_LOGGED_IN, () => {
                dispatch(login({ username: 'me', loggedIn: true }));
                setLoggedIn(true);
            });
            if (loggedIn === false) {
                setTimeout(() => instance.forceShowDialog(), 500);
            }
        }
    }, [instance]);
    return [setRef, container, loggedIn, instance];
}
//# sourceMappingURL=useLoginMenu.js.map