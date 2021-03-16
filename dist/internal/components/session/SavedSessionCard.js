import { I18nextManager, UserSession } from 'phovea_core';
import React from 'react';
import { Tab, Nav, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils } from 'tdp_core';
import { useAsync } from '../../../hooks';
import { GraphContext } from '../../OrdinoAppComponent';
import { ListItemDropdown } from '../common';
import { CommonSessionCard } from './CommonSessionCard';
import { SessionListItem } from './SessionListItem';
import { byDateDesc } from './utils';
export default function SavedSessionCard({ name, faIcon }) {
    const { manager } = React.useContext(GraphContext);
    const [sessions, setSessions] = React.useState(null);
    const listSessions = React.useMemo(() => async () => {
        var _a;
        const all = (_a = (await manager.list())) === null || _a === void 0 ? void 0 : _a.filter((d) => ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setSessions(all);
    }, []);
    const me = UserSession.getInstance().currentUserNameOrAnonymous();
    const savedSessions = sessions === null || sessions === void 0 ? void 0 : sessions.filter((d) => d.creator === me);
    const otherSessions = sessions === null || sessions === void 0 ? void 0 : sessions.filter((d) => d.creator !== me);
    const { status } = useAsync(listSessions);
    return (React.createElement(React.Fragment, null,
        React.createElement("p", { className: "ordino-info-text mt-4 " }, " Load a previous analysis session"),
        React.createElement(CommonSessionCard, { cardName: name, faIcon: faIcon, cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.savedCardInfo') }, (sessionAction) => {
            return React.createElement(Tab.Container, { defaultActiveKey: "mySessions" },
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
                                status === 'pending' &&
                                    React.createElement("p", null,
                                        React.createElement("i", { className: "fas fa-circle-notch fa-spin" }),
                                        " Loading sets..."),
                                status === 'success' &&
                                    savedSessions.length === 0 &&
                                    React.createElement("p", null, "No sets available"),
                                status === 'success' && savedSessions.length > 0 && (savedSessions === null || savedSessions === void 0 ? void 0 : savedSessions.map((session) => {
                                    return React.createElement(SessionListItem, { key: session.id, desc: session, selectSession: (event) => sessionAction("select" /* SELECT */, event, session) },
                                        React.createElement(Button, { variant: "outline-secondary", onClick: (event) => sessionAction("edit" /* EDIT */, event, session, setSessions), className: "mr-2 pt-1 pb-1" }, "Edit"),
                                        React.createElement(ListItemDropdown, null,
                                            React.createElement(Dropdown.Item, { onClick: (event) => sessionAction("epxport" /* EXPORT */, event, session) }, "Export"),
                                            React.createElement(Dropdown.Item, { className: "dropdown-delete", onClick: (event) => sessionAction("delete" /* DELETE */, event, session, setSessions) }, "Delete")));
                                })),
                                status === 'error' && React.createElement("p", null, "Error when loading sets")),
                            React.createElement(Tab.Pane, { eventKey: `publicSessions}` },
                                status === 'pending' &&
                                    React.createElement("p", null,
                                        React.createElement("i", { className: "fas fa-circle-notch fa-spin" }),
                                        " Loading sets..."),
                                status === 'success' &&
                                    otherSessions.length === 0 &&
                                    React.createElement("p", null, "No sets available"),
                                status === 'success' && otherSessions.length > 0 && (otherSessions === null || otherSessions === void 0 ? void 0 : otherSessions.map((session) => {
                                    return React.createElement(SessionListItem, { key: session.id, desc: session },
                                        React.createElement(Button, { variant: "outline-secondary", title: "Clone to Temporary Session", onClick: (event) => sessionAction("clone" /* CLONE */, event, session), className: "mr-2 pt-1 pb-1" }, "Clone"));
                                })),
                                status === 'error' && React.createElement("p", null, "Error when loading sets"))))));
        })));
}
//# sourceMappingURL=SavedSessionCard.js.map