import React from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { ListItemDropdown } from '../common/ListItemDropdown';
export function CurrentSessionListItem({ name, uploadedDate, description }) {
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, { className: "dropdown-parent session-item mx-0 mb-1  align-items-start" },
            React.createElement(Col, { md: 10, className: "d-flex flex-column px-0  align-items-start" },
                React.createElement(Button, { className: "pl-0", style: { color: '#337AB7' }, variant: "link" },
                    React.createElement("i", { className: "mr-2 fas fa-history" }),
                    name),
                description ? React.createElement("p", { className: "ml-4" },
                    description,
                    " ") : null,
                uploadedDate ? React.createElement("p", { className: "ml-4 text-muted" },
                    uploadedDate,
                    " ") : null),
            React.createElement(Col, { md: 2, className: "d-flex px-0 mt-1 justify-content-end" },
                React.createElement(Button, { variant: "outline-secondary", className: "mr-2 pt-1 pb-1" }, "Save"),
                React.createElement(ListItemDropdown, null,
                    React.createElement(Dropdown.Item, null, "Clone"),
                    React.createElement(Dropdown.Item, null, "Export"),
                    React.createElement(Dropdown.Item, { className: "dropdown-delete" }, "Delete"))))));
}
//# sourceMappingURL=CurrentSessionListItem.js.map