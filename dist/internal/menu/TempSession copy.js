import React from "react";
import { Button, ButtonGroup, Card, Col, Dropdown, Row } from 'react-bootstrap';
export const TempSessions = () => {
    return (React.createElement(Card, { style: {}, className: "shadow-sm" },
        React.createElement(Card.Body, { className: "p-3" },
            React.createElement(Card.Text, null, "A temporary session will only be stored in your local browser cache.It is not possible to share a link to states of this session with others. Only the 10 most recent sessions will be stored."),
            React.createElement(SessionEntry, { name: "Temporary session 20" }),
            React.createElement(SessionEntry, { name: "Temporary session 19" }),
            React.createElement(SessionEntry, { name: "Temporary session 18" }),
            React.createElement(SessionEntry, { name: "Temporary session 17" }))));
};
export const SessionEntry = ({ name }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, { className: "align-items-center" },
            React.createElement(Col, { md: 10 },
                React.createElement(Button, { variant: "link" },
                    React.createElement("i", { className: "mr-2 fas fa-history" }),
                    name)),
            React.createElement(Col, { md: 2, className: "d-flex justify-content-end" },
                React.createElement(Button, { variant: "outline-secondary", className: "mr-2 pt-1 pb-1" }, "Save"),
                React.createElement(Dropdown, { className: "session-dropdown", as: ButtonGroup },
                    React.createElement(Dropdown.Toggle, { style: { color: "black", }, variant: "link" },
                        React.createElement("i", { className: "fas fa-ellipsis-v " })),
                    React.createElement(Dropdown.Menu, { className: "super-colors" },
                        React.createElement(Dropdown.Item, { eventKey: "1" }, "Clone"),
                        React.createElement(Dropdown.Item, { eventKey: "2" }, "Export"),
                        React.createElement(Dropdown.Item, { style: { color: "red" }, eventKey: "3" }, "Delete"))),
                ' ')),
        React.createElement(Row, null,
            React.createElement(Col, null,
                React.createElement("p", { className: "ml-5 text-muted" }, "1 hour ago"))),
        React.createElement("hr", null)));
};
//# sourceMappingURL=TempSession copy.js.map