import { UserSession } from 'phovea_core';
import React from 'react';
import { Card, Tab, Nav, Row, Col } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils } from 'tdp_core';
import { byDateDesc, SavedSessionListItem } from '..';
import { useAsync } from '../../../hooks';
import { GraphContext } from '../../menu/StartMenuReact';
export function SavedSessionCard() {
    // Todo merge CurrentSessionCard with TemorarySessionCard
    const { manager } = React.useContext(GraphContext);
    const listSessions = React.useMemo(() => () => manager.list(), []);
    const { status, value: sessions, error } = useAsync(listSessions);
    const savedSessions = sessions === null || sessions === void 0 ? void 0 : sessions.filter((d) => ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
    const me = UserSession.getInstance().currentUserNameOrAnonymous();
    const myworkspaces = savedSessions === null || savedSessions === void 0 ? void 0 : savedSessions.filter((d) => d.creator === me);
    const otherworkspaces = savedSessions === null || savedSessions === void 0 ? void 0 : savedSessions.filter((d) => d.creator !== me);
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
                                React.createElement(Tab.Pane, { eventKey: "mySessions" }, myworkspaces === null || myworkspaces === void 0 ? void 0 : myworkspaces.map((session) => React.createElement(SavedSessionListItem, { key: session.id, status: status, value: session, error: error }))),
                                React.createElement(Tab.Pane, { eventKey: `publicSessions}` }, otherworkspaces === null || otherworkspaces === void 0 ? void 0 : otherworkspaces.map((session) => React.createElement(SavedSessionListItem, { key: session.id, status: status, value: session, error: error })))))))))));
}
//# sourceMappingURL=SavedSessionCard.js.map