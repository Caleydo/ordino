import React from 'react';
export function BurgerMenu(props) {
    return (React.createElement("button", { className: "btn btn-icon-gray", type: "button", onClick: () => props.onClick() },
        React.createElement("i", { className: "fas fa-bars" })));
}
//# sourceMappingURL=BurgerMenu.js.map