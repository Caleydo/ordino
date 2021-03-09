import { UserSession } from 'phovea_core';
import React from 'react';
import { Button, ButtonGroup, Col, Dropdown } from 'react-bootstrap';
import { SESSION_KEY_NEW_ENTRY_POINT } from '../..';
import { GraphContext } from '../../menu/StartMenuReact';
import { ListItemDropdown } from '../common/ListItemDropdown';
export function NamedSetList({ headerIcon, headerText, viewId, value, status, error, readonly }) {
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
        status === 'pending' &&
            React.createElement("p", null,
                React.createElement("i", { className: "fas fa-circle-notch fa-spin" }),
                " Loading sets..."),
        status === 'success' &&
            value.length === 0 &&
            React.createElement("p", null, "No sets available"),
        status === 'success' &&
            value.length > 0 &&
            React.createElement(ButtonGroup, { vertical: true }, value.map((entry, i) => {
                return (React.createElement(ButtonGroup, { key: i, className: "dropdown-parent justify-content-between" },
                    React.createElement(Button, { className: "text-left pl-0", style: { color: '#337AB7' }, variant: "link", onClick: (event) => initNewSession(event, viewId, value) }, entry.name),
                    readonly ||
                        React.createElement(ListItemDropdown, null,
                            React.createElement(Dropdown.Item, null, "Edit"),
                            React.createElement(Dropdown.Item, { className: "dropdown-delete" }, "Delete"))));
            })),
        status === 'error' && React.createElement("p", null, "Error when loading sets")));
}
//# sourceMappingURL=NamedSetList.js.map