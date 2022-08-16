import React from 'react';
export const ListItemDropdown = React.forwardRef(function ListItemDropdown(props, ref) {
    return (React.createElement("div", { className: "dropdown btn-group-vertical list-item-dropdown" },
        React.createElement("button", { className: "btn btn-link dropdown-toggle", type: "button", id: "dropdownMenuButton", "data-testid": "list-item-dropdown-button", "data-bs-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false" },
            React.createElement("i", { className: "fas fa-ellipsis-v" })),
        React.createElement("div", { className: "dropdown-menu", "data-bs-popper": "static", "aria-labelledby": "dropdownMenuButton" }, props.children)));
});
//# sourceMappingURL=ListItemDropdown.js.map