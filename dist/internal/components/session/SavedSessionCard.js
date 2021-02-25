import { GlobalEventHandler, I18nextManager, UserSession } from 'phovea_core';
import React from 'react';
import { Tab, Nav, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { ErrorAlertHandler, ProvenanceGraphMenuUtils } from 'tdp_core';
import { byDateDesc, ListItemDropdown, SessionListItem } from '..';
import { useAsync } from '../../../hooks';
import { GraphContext } from '../../menu/StartMenuReact';
import { stopEvent } from '../../menu/utils';
import { CommonSessionCard } from './CommonSessionCard';
export function SavedSessionCard() {
    const [savedSessions, setSavedSessions] = React.useState(null);
    const [otherSessions, setOtherSessions] = React.useState(null);
    const { manager } = React.useContext(GraphContext);
    const listSessions = React.useMemo(() => async () => {
        var _a;
        const sessions = (_a = (await manager.list())) === null || _a === void 0 ? void 0 : _a.filter((d) => ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        const me = UserSession.getInstance().currentUserNameOrAnonymous();
        const mine = sessions === null || sessions === void 0 ? void 0 : sessions.filter((d) => d.creator === me);
        const other = sessions === null || sessions === void 0 ? void 0 : sessions.filter((d) => d.creator !== me);
        setSavedSessions(mine);
        setOtherSessions(other);
    }, []);
    const { status, error } = useAsync(listSessions);
    // TODO why is the check for the graph necessary here?
    const editSession = (event, desc) => {
        stopEvent(event);
        // if (graph) {
        //   return false;
        // }
        ProvenanceGraphMenuUtils.editProvenanceGraphMetaData(desc, { permission: ProvenanceGraphMenuUtils.isPersistent(desc) }).then((extras) => {
            if (extras !== null) {
                Promise.resolve(manager.editGraphMetaData(desc, extras))
                    .then((desc) => {
                    setSavedSessions((savedSessions) => {
                        const copy = [...savedSessions];
                        const i = copy.findIndex((s) => s.id === desc.id);
                        copy[i] = desc;
                        return copy;
                    });
                    GlobalEventHandler.getInstance().fire(ProvenanceGraphMenuUtils.GLOBAL_EVENT_MANIPULATED);
                })
                    .catch(ErrorAlertHandler.getInstance().errorAlert);
            }
        });
        return false;
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("p", { className: "ordino-info-text mt-4 " }, " Load a previous analysis session"),
        React.createElement(CommonSessionCard, { cardName: "Saved Session", faIcon: "fa-cloud", cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.savedCardInfo') }, (exportSession, cloneSession, _, deleteSession) => {
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
                            React.createElement(Tab.Pane, { eventKey: "mySessions" }, savedSessions === null || savedSessions === void 0 ? void 0 : savedSessions.map((session) => {
                                return React.createElement(SessionListItem, { key: session.id, status: status, desc: session, error: error },
                                    React.createElement(Button, { variant: "outline-secondary", onClick: (event) => editSession(event, session), className: "mr-2 pt-1 pb-1" }, "Edit"),
                                    React.createElement(ListItemDropdown, null,
                                        React.createElement(Dropdown.Item, { onClick: (event) => cloneSession(event, session) }, "Clone"),
                                        React.createElement(Dropdown.Item, { onClick: (event) => exportSession(event, session) }, "Export"),
                                        React.createElement(Dropdown.Item, { className: "dropdown-delete", onClick: (event) => deleteSession(event, session, setSavedSessions) }, "Delete")));
                            })),
                            React.createElement(Tab.Pane, { eventKey: `publicSessions}` }, otherSessions === null || otherSessions === void 0 ? void 0 : otherSessions.map((session) => {
                                return React.createElement(SessionListItem, { key: session.id, status: status, desc: session, error: error },
                                    React.createElement(Button, { variant: "outline-secondary", onClick: (event) => cloneSession(event, session), className: "mr-2 pt-1 pb-1" }, "Clone"));
                            }))))));
        })));
}
//# sourceMappingURL=SavedSessionCard.js.map