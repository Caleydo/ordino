import React from 'react';
import { Button, ButtonGroup, Col, Dropdown, Row } from 'react-bootstrap';
export function SessionItem({ title }) {
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, { className: "align-items-center" },
            React.createElement(Col, { md: 10 },
                React.createElement(Button, { variant: "link" },
                    React.createElement("i", { className: "mr-2 fas fa-history" }),
                    title)),
            React.createElement(Col, { md: 2, className: "d-flex justify-content-end" },
                React.createElement(Button, { variant: "outline-secondary", className: "mr-2 pt-1 pb-1" }, "Save"),
                React.createElement(Dropdown, { className: "session-dropdown", as: ButtonGroup },
                    React.createElement(Dropdown.Toggle, { style: { color: '#6c757d', }, variant: "link" },
                        React.createElement("i", { className: "fas fa-ellipsis-v " })),
                    React.createElement(Dropdown.Menu, { className: "super-colors" },
                        React.createElement(Dropdown.Item, { eventKey: "1" }, "Clone"),
                        React.createElement(Dropdown.Item, { eventKey: "2" }, "Export"),
                        React.createElement(Dropdown.Item, { style: { color: 'red' }, eventKey: "3" }, "Delete"))),
                ' ')),
        React.createElement(Row, null,
            React.createElement(Col, null,
                React.createElement("p", { className: "ml-5 text-muted" }, "1 hour ago"))),
        React.createElement("hr", null)));
}
//# sourceMappingURL=SessionItem.js.map