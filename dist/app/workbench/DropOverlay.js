import * as React from 'react';
import { WorkbenchSwitchIcon } from './icons/WorkbenchSwitchIcon';
export function DropOverlay({ view }) {
    return (React.createElement("div", { style: {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 1,
            backgroundColor: 'lightgray',
        } },
        React.createElement(WorkbenchSwitchIcon, { view: view })));
}
//# sourceMappingURL=DropOverlay.js.map