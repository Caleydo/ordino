import * as React from 'react';
import { VisynHeader } from './VisynHeader';
export function VisynApp({ extensions: { header = React.createElement(VisynHeader, null) } = {}, children = null }) {
    return (React.createElement(React.Fragment, null,
        header,
        children));
}
//# sourceMappingURL=VisynApp.js.map