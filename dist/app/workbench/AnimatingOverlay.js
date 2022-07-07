import * as React from 'react';
export function AnimatingOverlay({ iconName, isAnimating, color }) {
    return (React.createElement("div", { className: `inner m-0 p-0 bg-white justify-content-center align-items-center ${!isAnimating ? 'd-none' : ''} d-flex` },
        React.createElement("i", { className: iconName, style: { fontSize: '80px', color } })));
}
//# sourceMappingURL=AnimatingOverlay.js.map