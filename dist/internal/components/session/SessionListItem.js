import { I18nextManager } from 'tdp_core';
import React from 'react';
import { ProvenanceGraphMenuUtils, TDPApplicationUtils } from 'tdp_core';
export function SessionListItem({ desc, selectSession, children }) {
    const dateString = desc.ts ? new Date(desc.ts).toUTCString() : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
    const dateFromNow = (desc === null || desc === void 0 ? void 0 : desc.ts) ? TDPApplicationUtils.fromNow(desc.ts) : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "row dropdown-parent session-item ms-0 mb-1 me-1 align-items-start", "data-testid": desc.id },
            React.createElement("div", { className: "d-flex px-0 flex-column align-items-start col-md-11" },
                React.createElement("button", { type: "button", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.continueSession'), "data-testid": 'continueSession-button', disabled: selectSession == null, className: "ps-0 btn btn-link align-self-start text-ordino-button-primary", onClick: (event) => selectSession(event, desc) },
                    React.createElement("i", { className: `me-2 fas ${desc.local ? 'fa-history' : 'fa-cloud'}` }),
                    desc.name),
                desc.description ? React.createElement("p", { className: "ms-4" },
                    desc.description,
                    " ") : null,
                React.createElement("div", { className: "pe-0 align-self-stretch row" },
                    React.createElement("div", { className: "col position-relative" }, dateFromNow ? React.createElement("p", { className: "flex-grow-1 ms-4 text-muted", title: dateString },
                        dateFromNow,
                        " ") : null),
                    desc.local ? null :
                        React.createElement("div", { className: "col position-relative" }, ProvenanceGraphMenuUtils.isPublic(desc) ?
                            React.createElement("p", { className: "text-muted flex-grow-1", title: I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status') },
                                React.createElement("i", { className: "me-2 fas fa-users" }),
                                I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.publicAccess')) :
                            React.createElement("p", { className: "text-muted flex-grow-1", title: I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status', { context: 'private' }) },
                                React.createElement("i", { className: "me-2 fas fa-user" }),
                                I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.privateAccess'))))),
            React.createElement("div", { className: "d-flex px-0 mt-1 justify-content-end col-md-1" }, children))));
}
//# sourceMappingURL=SessionListItem.js.map