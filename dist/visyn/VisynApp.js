import * as React from 'react';
import { useAppSelector } from '..';
import { VisynHeader } from './VisynHeader';
export function VisynApp({ extensions: { header = React.createElement(VisynHeader, null) } = {}, children = null }) {
    const user = useAppSelector((state) => state.user);
    const [initialized, setInitialized] = React.useState(false);
    return (React.createElement(React.Fragment, null,
        header,
        user.loggedIn ?
            React.createElement(React.Fragment, null, children)
            : null));
}
//# sourceMappingURL=VisynApp.js.map