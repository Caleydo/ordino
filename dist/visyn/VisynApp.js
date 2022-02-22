import * as React from 'react';
import { useAppSelector } from '..';
import { useInitVisynApp } from './hooks/useInitVisynApp';
import { VisynHeader } from './VisynHeader';
export function VisynApp({ extensions: { header = React.createElement(VisynHeader, null) } = {}, children = null }) {
    const user = useAppSelector((state) => state.user);
    const { status } = useInitVisynApp();
    return (React.createElement(React.Fragment, null, status === 'success' ? (React.createElement(React.Fragment, null,
        header,
        user.loggedIn ? React.createElement(React.Fragment, null, children) : null)) : null // TODO:show loading overlay while initializing?
    ));
}
//# sourceMappingURL=VisynApp.js.map