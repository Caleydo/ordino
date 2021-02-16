import React from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { ListItemDropdown } from './ListItemDropdown';
export function UploadDatasetListItem({ name, accessType, uploadedDate, description }) {
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, { className: "dropdown-parent session-item mx-0 mb-1 align-items-start" },
            React.createElement(Col, { md: 11, className: "d-flex px-0 flex-column align-items-start" },
                React.createElement(Button, { variant: "link", className: "pl-0", style: { color: '#337AB7' } },
                    React.createElement("i", { className: "mr-2 fas fa-file-csv" }),
                    name),
                description ? React.createElement("p", { className: "pl-3" },
                    description,
                    " ") : null,
                React.createElement(Row, { className: "pl-5 justify-content-start  align-self-stretch" },
                    uploadedDate ? React.createElement("p", { className: "flex-grow-1 text-muted" },
                        uploadedDate,
                        " ") : null,
                    accessType === 'public' ?
                        React.createElement("p", { className: "text-muted flex-grow-1" },
                            React.createElement("i", { className: "mr-2 fas fa-users" }),
                            "Public access") :
                        React.createElement("p", { className: "text-muted flex-grow-1" },
                            React.createElement("i", { className: "mr-2 fas fa-user" }),
                            "Private access"))),
            React.createElement(Col, { md: 1, className: "d-flex px-0 mt-1 justify-content-end" },
                React.createElement(ListItemDropdown, null,
                    React.createElement(Dropdown.Item, null, "Edit"),
                    React.createElement(Dropdown.Item, { className: "dropdown-delete" }, "Delete"))))));
}
//# sourceMappingURL=UploadDatasetListItem.js.map