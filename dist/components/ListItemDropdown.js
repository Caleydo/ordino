import React from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
// tslint:disable-next-line: variable-name
export const ListItemDropdown = React.forwardRef((props, ref) => {
    return (React.createElement(Dropdown, { ref: ref, vertical: true, className: "list-item-dropdown", as: ButtonGroup },
        React.createElement(Dropdown.Toggle, { variant: "link" },
            React.createElement("i", { className: "fas fa-ellipsis-v " })),
        React.createElement(Dropdown.Menu, null, props.children)));
});
//# sourceMappingURL=ListItemDropdown.js.map