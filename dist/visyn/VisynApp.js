/* eslint-disable import/no-cycle */
import * as React from 'react';
import { BusyOverlay } from './BusyOverlay';
import { VisynLoginForm as DefaultLoginForm } from './headerComponents';
import { useInitVisynApp } from './hooks/useInitVisynApp';
import { VisynLoginMenu } from './LoginMenu';
import { VisynHeader } from './VisynHeader';
const visynAppComponents = {
    Header: VisynHeader,
    LoginForm: DefaultLoginForm,
};
export function VisynApp({ extensions, children = null, watch = false }) {
    const { Header, LoginForm } = { ...visynAppComponents, ...extensions };
    const { status } = useInitVisynApp();
    return status === 'success' ? (React.createElement(React.Fragment, null,
        React.createElement(Header, null),
        React.createElement(VisynLoginMenu, { watch: watch, extensions: { LoginForm } }),
        React.createElement("div", { className: "content" }, children))) : (React.createElement(BusyOverlay, null));
}
//# sourceMappingURL=VisynApp.js.map