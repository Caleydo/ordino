import React from 'react';
// tslint:disable-next-line: variable-name
// eslint-disable-next-line react/display-name
export const ListItemDropdown = React.forwardRef((props) => {
    return (React.createElement("div", { className: "dropdown btn-group-vertical list-item-dropdown" },
        React.createElement("button", { className: "btn btn-link dropdown-toggle", type: "button", id: "dropdownMenuButton", "data-bs-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false" },
            React.createElement("i", { className: "fas fa-ellipsis-v" })),
        React.createElement("div", { className: "dropdown-menu", "data-bs-popper": "static", "aria-labelledby": "dropdownMenuButton" }, props.children)));
});
//# sourceMappingURL=ListItemDropdown.js.map