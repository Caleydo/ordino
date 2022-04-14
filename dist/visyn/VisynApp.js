import * as React from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useInitVisynApp } from './hooks/useInitVisynApp';
import { VisynHeader } from './VisynHeader';
export function VisynApp({ extensions: { Header = React.createElement(VisynHeader, null) } = {}, children = null }) {
    const user = useAppSelector((state) => state.user);
    const { status } = useInitVisynApp();
    return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, status === 'success' ? (React.createElement(React.Fragment, null,
        Header,
        user.loggedIn ? children : null)) : null // TODO:show loading overlay while initializing?
    ));
}
//# sourceMappingURL=VisynApp.js.map