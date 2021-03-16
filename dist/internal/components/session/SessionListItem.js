import { I18nextManager } from 'phovea_core';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils, TDPApplicationUtils } from 'tdp_core';
export function SessionListItem({ desc, selectSession, children }) {
    const dateFromNow = (desc === null || desc === void 0 ? void 0 : desc.ts) ? TDPApplicationUtils.fromNow(desc.ts) : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, { className: "dropdown-parent session-item mx-0 mb-1 align-items-start" },
            React.createElement(Col, { md: 10, className: "d-flex flex-column px-0 align-items-start" },
                React.createElement(Button, { variant: "link", disabled: selectSession == null, className: "pl-0", style: { color: '#337AB7' }, onClick: (event) => selectSession(event, desc) },
                    React.createElement("i", { className: `mr-2 fas ${desc.local ? 'fa-history' : 'fa-cloud'}` }),
                    desc.name),
                desc.description ? React.createElement("p", { className: "ml-4" },
                    desc.description,
                    " ") : null,
                React.createElement(Row, { className: "pr-0  align-self-stretch" },
                    React.createElement(Col, null, dateFromNow ? React.createElement("p", { className: "flex-grow-1 ml-4 text-muted" },
                        dateFromNow,
                        " ") : null),
                    desc.local ? null :
                        React.createElement(Col, null, ProvenanceGraphMenuUtils.isPublic(desc) ?
                            React.createElement("p", { className: "text-muted flex-grow-1", title: I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status') },
                                React.createElement("i", { className: "mr-2 fas fa-users" }),
                                "Public access") :
                            React.createElement("p", { className: "text-muted flex-grow-1", title: I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status', { context: 'private' }) },
                                React.createElement("i", { className: "mr-2 fas fa-user" }),
                                "Private access")))),
            React.createElement(Col, { md: 2, className: "d-flex justify-content-end mt-1 px-0" }, children))));
}
//# sourceMappingURL=SessionListItem.js.map