import { UserSession } from 'phovea_core';
import React from 'react';
import { Button, ButtonGroup, Col, Dropdown } from 'react-bootstrap';
import { SESSION_KEY_NEW_ENTRY_POINT } from '../..';
import { GraphContext } from '../../menu/StartMenuReact';
import { ListItemDropdown } from '../common/ListItemDropdown';
export function NamedSetList({ headerIcon, headerText, value, status, error, readonly }) {
    const { manager } = React.useContext(GraphContext);
    const initNewSession = (event, view, options, defaultSessionValues = null) => {
        event.preventDefault();
        UserSession.getInstance().store(SESSION_KEY_NEW_ENTRY_POINT, {
            view,
            options,
            defaultSessionValues
        });
        manager.newGraph();
    };
    return (React.createElement(Col, { md: 4, className: "dataset-entry d-flex flex-column" },
        React.createElement("header", null,
            React.createElement("i", { className: `mr-2 ${headerIcon}` }),
            headerText),
        status === 'success' &&
            React.createElement(ButtonGroup, { vertical: true }, value.map((entry, i) => {
                return (React.createElement(ButtonGroup, { key: i, className: "dropdown-parent justify-content-between" },
                    React.createElement(Button, { className: "text-left pl-0", style: { color: '#337AB7' }, variant: "link", onClick: (event) => initNewSession(event, 'celllinedb_start', value) }, entry.name),
                    readonly ||
                        React.createElement(ListItemDropdown, null,
                            React.createElement(Dropdown.Item, null, "Edit"),
                            React.createElement(Dropdown.Item, { className: "dropdown-delete" }, "Delete"))));
            })),
        status === 'error' && React.createElement("div", null, error)));
}
//# sourceMappingURL=NamedSetList.js.map