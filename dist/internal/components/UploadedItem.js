import React from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { DatasetEntryDropdown } from './DatasetSection';
export function UploadedItem({ name, accessType, uploadedDate, description }) {
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
                React.createElement(DatasetEntryDropdown, null,
                    React.createElement(Dropdown.Item, null, "Edit"),
                    React.createElement(Dropdown.Item, { className: "dropdown-delete" }, "Delete"))))));
}
export function CurrentItem({ name, uploadedDate, description }) {
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
                React.createElement(DatasetEntryDropdown, null,
                    React.createElement(Dropdown.Item, null, "Clone"),
                    React.createElement(Dropdown.Item, null, "Export"),
                    React.createElement(Dropdown.Item, { className: "dropdown-delete" }, "Delete"))))));
}
export function SavedItem({ name, uploadedDate, accessType, description }) {
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, { className: "dropdown-parent session-item mx-0 mb-1 align-items-start" },
            React.createElement(Col, { md: 10, className: "d-flex flex-column px-0 align-items-start" },
                React.createElement(Button, { variant: "link", className: "pl-0", style: { color: '#337AB7' } },
                    React.createElement("i", { className: "mr-2 fas fa-cloud" }),
                    name),
                description ? React.createElement("p", { className: "ml-4" },
                    description,
                    " ") : null,
                React.createElement(Row, { className: "pr-0 pl-4  align-self-stretch" },
                    React.createElement(Col, { md: 6 }, uploadedDate ? React.createElement("p", { className: "flex-grow-1 text-muted" },
                        uploadedDate,
                        " ") : null),
                    React.createElement(Col, { md: 6 }, accessType === 'public' ?
                        React.createElement("p", { className: "text-muted flex-grow-1" },
                            React.createElement("i", { className: "mr-2 fas fa-users" }),
                            "Public access") :
                        React.createElement("p", { className: "text-muted flex-grow-1" },
                            React.createElement("i", { className: "mr-2 fas fa-user" }),
                            "Private access")))),
            React.createElement(Col, { md: 2, className: "d-flex justify-content-end mt-1 px-0" },
                React.createElement(Button, { variant: "outline-secondary", className: "mr-2 pt-1 pb-1" }, "Edit"),
                React.createElement(DatasetEntryDropdown, null,
                    React.createElement(Dropdown.Item, null, "Clone"),
                    React.createElement(Dropdown.Item, null, "Export"),
                    React.createElement(Dropdown.Item, { className: "dropdown-delete" }, "Delete"))))));
}
//# sourceMappingURL=UploadedItem.js.map