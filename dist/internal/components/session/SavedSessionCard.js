import { I18nextManager, UserSession, UniqueIdManager } from 'phovea_core';
import React from 'react';
import { ProvenanceGraphMenuUtils } from 'tdp_core';
import { useAsync } from '../../../hooks';
import { GraphContext } from '../../OrdinoApp';
import { ListItemDropdown } from '../../../components';
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
    const id = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);
    return (React.createElement(React.Fragment, null,
        React.createElement("p", { className: "lead text-gray-600 mb-4" }, "Load a previous analysis session"),
        React.createElement(CommonSessionCard, { cardName: name, faIcon: faIcon, cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.savedCardInfo') }, (sessionAction) => {
            return React.createElement(React.Fragment, null,
                React.createElement("ul", { className: "nav nav-pills session-tab card-header-pills", role: "tablist" },
                    React.createElement("li", { className: "nav-item", role: "presentation" },
                        React.createElement("a", { className: "nav-link active", id: `saved-session-tab-${id}`, "data-bs-toggle": "tab", href: `#saved-session-mine-panel-${id}`, role: "tab", "aria-controls": `saved-session-mine-panel-${id}`, "aria-selected": "true" },
                            React.createElement("i", { className: "me-2 fas fa-user" }),
                            I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.mySessions'))),
                    React.createElement("li", { className: "nav-item", role: "presentation" },
                        React.createElement("a", { className: "nav-link", id: `saved-session-other-tab-${id}`, "data-bs-toggle": "tab", href: `#saved-session-other-panel-${id}`, role: "tab", "aria-controls": `saved-session-other-panel-${id}`, "aria-selected": "false" },
                            React.createElement("i", { className: "me-2 fas fa-users" }),
                            I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.otherSessions')))),
                React.createElement("div", { className: "row pt-4" },
                    React.createElement("div", { className: "col" },
                        React.createElement("div", { className: "tab-content position-relative" },
                            React.createElement("div", { className: "tab-pane fade show active ordino-session-list", role: "tabpanel", id: `saved-session-mine-panel-${id}`, "aria-labelledby": `saved-session-mine-tab-${id}` },
                                status === 'pending' &&
                                    React.createElement("p", null,
                                        React.createElement("i", { className: "fas fa-circle-notch fa-spin" }),
                                        " ",
                                        I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingSets')),
                                status === 'success' &&
                                    savedSessions.length === 0 &&
                                    React.createElement("p", null, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.noSetsAvailable')),
                                status === 'success' && savedSessions.length > 0 && (savedSessions === null || savedSessions === void 0 ? void 0 : savedSessions.map((session) => {
                                    return React.createElement(SessionListItem, { key: session.id, desc: session, selectSession: (event) => sessionAction("select" /* SELECT */, event, session) },
                                        React.createElement("button", { type: "button", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.editDetails'), onClick: (event) => sessionAction("edit" /* EDIT */, event, session, setSessions), className: "me-2 pt-1 pb-1 btn btn-outline-secondary" }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.edit')),
                                        React.createElement(ListItemDropdown, null,
                                            React.createElement("button", { type: "button", className: "dropdown-item", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.cloneToTemporary'), onClick: (event) => sessionAction("clone" /* CLONE */, event, session) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.clone')),
                                            React.createElement("button", { type: "button", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.deleteSession'), className: "dropdown-item dropdown-delete", onClick: (event) => sessionAction("delete" /* DELETE */, event, session, setSessions) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete'))));
                                })),
                                status === 'error' && React.createElement("p", null, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingError'))),
                            React.createElement("div", { className: "tab-pane fade", role: "tabpanel", id: `saved-session-other-panel-${id}`, "aria-labelledby": `saved-session-other-tab-${id}` },
                                status === 'pending' &&
                                    React.createElement("p", null,
                                        React.createElement("i", { className: "fas fa-circle-notch fa-spin" }),
                                        " ",
                                        I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingSets')),
                                status === 'success' &&
                                    otherSessions.length === 0 &&
                                    React.createElement("p", null, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.noSetsAvailable')),
                                status === 'success' && otherSessions.length > 0 && (otherSessions === null || otherSessions === void 0 ? void 0 : otherSessions.map((session) => {
                                    return React.createElement(SessionListItem, { key: session.id, desc: session },
                                        React.createElement("button", { type: "button", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.cloneToTemporary'), onClick: (event) => sessionAction("clone" /* CLONE */, event, session), className: "me-2 pt-1 pb-1 btn btn-outline-secondary" }, "Clone"));
                                })),
                                status === 'error' && React.createElement("p", null, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingError')))))));
        })));
}
//# sourceMappingURL=SavedSessionCard.js.map