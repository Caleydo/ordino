import React from 'react';
import { Card, Tab, Nav, Row, Col } from 'react-bootstrap';
import { SavedSessionListItem } from '..';
export function SavedSessionCard() {
    return (React.createElement(React.Fragment, null,
        React.createElement("p", { className: "ordino-info-text mt-4 " }, " Load a previous analysis session"),
        React.createElement("h4", { className: "text-left mt-2 mb-3" },
            React.createElement("i", { className: "mr-2 ordino-icon-2 fas fa-cloud" }),
            " Saved Session"),
        React.createElement(Card, { className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                React.createElement(Card.Text, null, "The saved session will be stored on the server. By default, sessions are private, meaning that only the creator has access to it. If the status is set to public, others can also see the session and access certain states by opening a shared link."),
                React.createElement(Tab.Container, { defaultActiveKey: "mySessions" },
                    React.createElement(Nav, { className: "session-tab", variant: "pills" },
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "mySessions" },
                                React.createElement("i", { className: "mr-2 fas fa-user" }),
                                "My sessions")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: `publicSessions}` },
                                " ",
                                React.createElement("i", { className: "mr-2 fas fa-users" }),
                                "Public sessions"))),
                    React.createElement(Row, { className: "pt-4" },
                        React.createElement(Col, null,
                            React.createElement(Tab.Content, null,
                                React.createElement(Tab.Pane, { eventKey: "mySessions" },
                                    React.createElement(SavedSessionListItem, { name: "Ordino NMC Case Study 1", uploadedDate: "20 minutes ago", accessType: "private" }),
                                    React.createElement(SavedSessionListItem, { name: "Saved Session 1", uploadedDate: "20 minutes ago", accessType: "private" }),
                                    React.createElement(SavedSessionListItem, { name: "Saved Session 5", description: "This is an optional description for the saved session", uploadedDate: "1 hour ago", accessType: "public" }),
                                    React.createElement(SavedSessionListItem, { name: "Saved Session 22", uploadedDate: "2 days ago", accessType: "public" })),
                                React.createElement(Tab.Pane, { eventKey: `publicSessions}` },
                                    React.createElement(SavedSessionListItem, { name: "Saved Session 1", uploadedDate: "20 minutes ago", accessType: "public" }),
                                    React.createElement(SavedSessionListItem, { name: "Saved Session 33", uploadedDate: "20 minutes ago", accessType: "public" }),
                                    React.createElement(SavedSessionListItem, { name: "Saved Session 50", uploadedDate: "1 hour ago", accessType: "public" }),
                                    React.createElement(SavedSessionListItem, { name: "Saved Session 90", uploadedDate: "2 days ago", accessType: "public" }))))))))));
}
//# sourceMappingURL=SavedSessionCard.js.map