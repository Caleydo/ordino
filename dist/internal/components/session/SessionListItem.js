import { I18nextManager } from 'phovea_core';
import React from 'react';
import { ProvenanceGraphMenuUtils, TDPApplicationUtils } from 'tdp_core';
export function SessionListItem({ desc, selectSession, children }) {
    const dateFromNow = (desc === null || desc === void 0 ? void 0 : desc.ts) ? TDPApplicationUtils.fromNow(desc.ts) : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "row dropdown-parent session-item mx-0 mb-1 align-items-start" },
            React.createElement("div", { className: "d-flex px-0 flex-column align-items-start col-md-11" },
                React.createElement("button", { type: "button", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.continueSession'), disabled: selectSession == null, className: "pl-0 btn btn-link text-ordino-button-primary", onClick: (event) => selectSession(event, desc) },
                    React.createElement("i", { className: `mr-2 fas ${desc.local ? 'fa-history' : 'fa-cloud'}` }),
                    desc.name),
                desc.description ? React.createElement("p", { className: "ml-4" },
                    desc.description,
                    " ") : null,
                React.createElement("div", { className: "pr-0 align-self-stretch row" },
                    React.createElement("div", { className: "col" }, dateFromNow ? React.createElement("p", { className: "flex-grow-1 ml-4 text-muted" },
                        dateFromNow,
                        " ") : null),
                    desc.local ? null :
                        React.createElement("div", { className: "col" }, ProvenanceGraphMenuUtils.isPublic(desc) ?
                            React.createElement("p", { className: "text-muted flex-grow-1", title: I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status') },
                                React.createElement("i", { className: "mr-2 fas fa-users" }),
                                I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.publicAccess')) :
                            React.createElement("p", { className: "text-muted flex-grow-1", title: I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status', { context: 'private' }) },
                                React.createElement("i", { className: "mr-2 fas fa-user" }),
                                I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.privateAccess'))))),
            React.createElement("div", { className: "d-flex px-0 mt-1 justify-content-end col-md-1" }, children))));
}
//# sourceMappingURL=SessionListItem.js.map