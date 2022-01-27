import React from 'react';
import { AppHeader, LoginMenu } from 'tdp_core';
import { login, logout, useAppDispatch, useAppSelector } from '../..';
/**
 * Instantiates the login menu and appends the user dropdown to the header
 */
export function useLoginMenu() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const [instance, setInstance] = React.useState(null);
    const containerRef = React.useRef(null);
    const setRef = React.useCallback((ref) => {
        setInstance((currentInstance) => {
            // If the element ref did not change, do nothing.
            if (currentInstance && ref) {
                return currentInstance;
            }
            // Create a new one if there is a ref
            if (ref) {
                containerRef.current = ref;
                const menu = new LoginMenu(new AppHeader(ref), { watch: true });
                return menu;
            }
            // Set instance to null if no ref is passed
            return null;
        });
    }, []);
    React.useEffect(() => {
        if (instance === null || instance === void 0 ? void 0 : instance.node) {
            containerRef.current.appendChild(instance.node);
        }
    }, [containerRef, instance]);
    React.useEffect(() => {
        if (instance) {
            let forceShowLoginDialogTimeout = -1;
            instance.on(LoginMenu.EVENT_LOGGED_OUT, () => {
                dispatch(logout());
                instance.forceShowDialog();
            });
            instance.on(LoginMenu.EVENT_LOGGED_IN, () => {
                dispatch(login());
                clearTimeout(forceShowLoginDialogTimeout);
            });
            if (!user.loggedIn) {
                //wait .5sec before showing the login dialog to give the auto login mechanism a chance
                forceShowLoginDialogTimeout = setTimeout(() => instance.forceShowDialog(), 500);
            }
            return () => {
                instance.off(LoginMenu.EVENT_LOGGED_OUT);
                instance.off(LoginMenu.EVENT_LOGGED_IN);
            };
        }
    }, [instance]);
    return { ref: setRef, loggedIn: user.loggedIn, instance };
}
//# sourceMappingURL=useLoginMenu.js.map