import React from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
export function ListItemDropdown(props) {
    return (React.createElement(Dropdown, { vertical: true, className: "list-item-dropdown", as: ButtonGroup },
        React.createElement(Dropdown.Toggle, { variant: "link" },
            React.createElement("i", { className: "fas fa-ellipsis-v " })),
        React.createElement(Dropdown.Menu, null, props.children)));
}
//# sourceMappingURL=ListItemDropdown.js.map