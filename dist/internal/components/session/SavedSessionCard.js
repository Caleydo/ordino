import { GlobalEventHandler, I18nextManager, UserSession } from 'phovea_core';
import React, { useRef } from 'react';
import { Card, Tab, Nav, Row, Col } from 'react-bootstrap';
import { ErrorAlertHandler, FormDialog, NotificationHandler, ProvenanceGraphMenuUtils } from 'tdp_core';
import { byDateDesc, SavedSessionListItem } from '..';
import { useAsync } from '../../../hooks';
import { GraphContext } from '../../menu/StartMenuReact';
export function SavedSessionCard() {
    const parent = useRef(null);
    const stopEvent = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const [savedSessions, setSavedSessions] = React.useState(null);
    const [otherSessions, setOtherSessions] = React.useState(null);
    const { graph, manager } = React.useContext(GraphContext);
    const listSessions = React.useMemo(() => async () => {
        var _a;
        const sessions = (_a = (await manager.list())) === null || _a === void 0 ? void 0 : _a.filter((d) => ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        const me = UserSession.getInstance().currentUserNameOrAnonymous();
        const mine = sessions === null || sessions === void 0 ? void 0 : sessions.filter((d) => d.creator === me);
        // TODO how to get the other saved sessions
        const other = sessions === null || sessions === void 0 ? void 0 : sessions.filter((d) => d.creator !== me);
        setSavedSessions(mine);
        setOtherSessions(other);
    }, []);
    const { status, error } = useAsync(listSessions);
    const deleteSession = async (event, value) => {
        stopEvent(event);
        const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.deleteIt', { name: value.name }));
        if (deleteIt) {
            await manager.delete(value);
            NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.session'), value.name);
            setSavedSessions(savedSessions === null || savedSessions === void 0 ? void 0 : savedSessions.filter((t) => t.id !== value.id));
        }
        return false;
    };
    const editSession = (event, value) => {
        stopEvent(event);
        // if (graph) {
        //   return false;
        // }
        ProvenanceGraphMenuUtils.editProvenanceGraphMetaData(value, { permission: ProvenanceGraphMenuUtils.isPersistent(value) }).then((extras) => {
            if (extras !== null) {
                Promise.resolve(manager.editGraphMetaData(value, extras))
                    .then((desc) => {
                    setSavedSessions((savedSessions) => {
                        const copy = [...savedSessions];
                        const i = copy.findIndex((s) => s.id === value.id);
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
    const cloneSession = (event, value) => {
        stopEvent(event);
        manager.cloneLocal(value);
        return false;
    };
    // How to handle export of temorary and saved sessions
    const exportSession = (event, value) => {
        stopEvent(event);
        if (!graph) {
            return false;
        }
        console.log(graph);
        const r = graph.persist();
        console.log(r);
        const str = JSON.stringify(r, null, '\t');
        //create blob and save it
        const blob = new Blob([str], { type: 'application/json;charset=utf-8' });
        const a = new FileReader();
        a.onload = (e) => {
            console.log('hello');
            const url = (e.target).result;
            const helper = parent.current.ownerDocument.createElement('a');
            helper.setAttribute('href', url);
            helper.setAttribute('target', '_blank');
            helper.setAttribute('download', `${graph.desc.name}.json`);
            parent.current.appendChild(helper);
            helper.click();
            helper.remove();
            NotificationHandler.pushNotification('success', I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.successMessage', { name: graph.desc.name }), NotificationHandler.DEFAULT_SUCCESS_AUTO_HIDE);
        };
        a.readAsDataURL(blob);
        return false;
    };
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
                                React.createElement(Tab.Pane, { eventKey: "mySessions" }, savedSessions === null || savedSessions === void 0 ? void 0 : savedSessions.map((session) => React.createElement(SavedSessionListItem, { key: session.id, status: status, value: session, error: error, exportSession: exportSession, editSession: editSession, cloneSession: cloneSession, deleteSession: deleteSession }))),
                                React.createElement(Tab.Pane, { eventKey: `publicSessions}` }, otherSessions === null || otherSessions === void 0 ? void 0 : otherSessions.map((session) => React.createElement(SavedSessionListItem, { key: session.id, status: status, value: session, error: error })))))))))));
}
//# sourceMappingURL=SavedSessionCard.js.map