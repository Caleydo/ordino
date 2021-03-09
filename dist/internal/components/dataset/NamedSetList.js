import React from 'react';
import { Button, ButtonGroup, Col, Dropdown } from 'react-bootstrap';
import { AppContext } from '../../menu/StartMenuReact';
import { ListItemDropdown } from '../common';
export function NamedSetList({ headerIcon, headerText, viewId, value, status, readonly }) {
    const { app } = React.useContext(AppContext);
    const open = (event) => {
        event.preventDefault();
        app.initNewSession(viewId, value);
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
                    React.createElement(Button, { className: "text-left pl-0", style: { color: '#337AB7' }, variant: "link", onClick: open }, entry.name),
                    readonly ||
                        React.createElement(ListItemDropdown, null,
                            React.createElement(Dropdown.Item, null, "Edit"),
                            React.createElement(Dropdown.Item, { className: "dropdown-delete" }, "Delete"))));
            })),
        status === 'error' && React.createElement("p", null, "Error when loading sets")));
}
//# sourceMappingURL=NamedSetList.js.map