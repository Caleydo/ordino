import { I18nextManager } from 'phovea_core';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils, TDPApplicationUtils } from 'tdp_core';
export function SessionListItem({ status, value, error, editSession, cloneSession, exportSession, deleteSession, children }) {
    const dateFromNow = (value === null || value === void 0 ? void 0 : value.ts) ? TDPApplicationUtils.fromNow(value.ts) : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
    return (React.createElement(React.Fragment, null,
        status === 'success' &&
            React.createElement(Row, { className: "dropdown-parent session-item mx-0 mb-1 align-items-start" },
                React.createElement(Col, { md: 10, className: "d-flex flex-column px-0 align-items-start" },
                    React.createElement(Button, { variant: "link", className: "pl-0", style: { color: '#337AB7' } },
                        React.createElement("i", { className: `mr-2 fas ${value.local ? 'fa-history' : 'fa-cloud'}` }),
                        value.name),
                    value.description ? React.createElement("p", { className: "ml-4" },
                        value.description,
                        " ") : null,
                    React.createElement(Row, { className: "pr-0 pl-4  align-self-stretch" },
                        React.createElement(Col, { md: 6 }, dateFromNow ? React.createElement("p", { className: "flex-grow-1 text-muted" },
                            dateFromNow,
                            " ") : null),
                        value.local ? null :
                            React.createElement(Col, { md: 6 }, ProvenanceGraphMenuUtils.isPublic(value) ?
                                React.createElement("p", { className: "text-muted flex-grow-1", title: I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status') },
                                    React.createElement("i", { className: "mr-2 fas fa-users" }),
                                    "Public access") :
                                React.createElement("p", { className: "text-muted flex-grow-1", title: I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status', { context: 'private' }) },
                                    React.createElement("i", { className: "mr-2 fas fa-user" }),
                                    "Private access")))),
                React.createElement(Col, { md: 2, className: "d-flex justify-content-end mt-1 px-0" }, children)),
        status === 'error' && React.createElement("div", null, error)));
}
//# sourceMappingURL=SavedSessionListItem.js.map