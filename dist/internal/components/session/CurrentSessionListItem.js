import { I18nextManager } from 'phovea_core';
import React from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { TDPApplicationUtils } from 'tdp_core';
import { ListItemDropdown } from '../common/ListItemDropdown';
export function CurrentSessionListItem({ status, value, error, description }) {
    const dateFromNow = (value === null || value === void 0 ? void 0 : value.ts) ? TDPApplicationUtils.fromNow(value.ts) : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
    return (React.createElement(React.Fragment, null,
        status === 'success' &&
            React.createElement(Row, { className: "dropdown-parent session-item mx-0 mb-1  align-items-start" },
                React.createElement(Col, { md: 10, className: "d-flex flex-column px-0  align-items-start" },
                    React.createElement(Button, { className: "pl-0", style: { color: '#337AB7' }, variant: "link" },
                        React.createElement("i", { className: "mr-2 fas fa-history" }),
                        value.name),
                    description ? React.createElement("p", { className: "ml-4" },
                        description,
                        " ") : null,
                    dateFromNow ? React.createElement("p", { className: "ml-4 text-muted" },
                        dateFromNow,
                        " ") : null),
                React.createElement(Col, { md: 2, className: "d-flex px-0 mt-1 justify-content-end" },
                    React.createElement(Button, { variant: "outline-secondary", className: "mr-2 pt-1 pb-1" }, "Save"),
                    React.createElement(ListItemDropdown, null,
                        React.createElement(Dropdown.Item, null, "Clone"),
                        React.createElement(Dropdown.Item, null, "Export"),
                        React.createElement(Dropdown.Item, { className: "dropdown-delete" }, "Delete")))),
        status === 'error' && React.createElement("div", null, error)));
}
//# sourceMappingURL=CurrentSessionListItem.js.map