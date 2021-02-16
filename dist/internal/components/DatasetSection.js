import React from 'react';
import { Button, ButtonGroup, Col, Dropdown, Row, } from 'react-bootstrap';
import { DatasetSearchBox } from './DatasetSearchBox';
const predefinedSets = [
    'All',
    'Cancer Gene Census',
    'Essential Genes',
];
const publicSets = [
    'Dd',
    'TP53 Predictor Score',
    'List'
];
const privateSets = [
    'My Collection',
    'Research Focus 1',
    'Research Focus 2'
];
function DatasetEntries({ headerIcon, headerText, entries, readonly }) {
    return (React.createElement(Col, { md: 4, className: "dataset-entry d-flex flex-column" },
        React.createElement("header", null,
            React.createElement("i", { className: `mr-2 ${headerIcon}` }),
            headerText),
        React.createElement(ButtonGroup, { vertical: true }, entries.map((entry, i) => {
            return (React.createElement(ButtonGroup, { key: i, className: "dropdown-parent justify-content-between" },
                React.createElement(Button, { className: "text-left pl-0", style: { color: '#337AB7' }, variant: "link" }, entry),
                readonly ||
                    React.createElement(DatasetEntryDropdown, null,
                        React.createElement(Dropdown.Item, null, "Edit"),
                        React.createElement(Dropdown.Item, { className: "dropdown-delete" }, "Delete"))));
        }))));
}
export function DatasetEntryDropdown(props) {
    return (React.createElement(Dropdown, { vertical: true, className: "session-dropdown", as: ButtonGroup },
        React.createElement(Dropdown.Toggle, { variant: "link" },
            React.createElement("i", { className: "fas fa-ellipsis-v " })),
        React.createElement(Dropdown.Menu, null, props.children)));
}
export function DatasetSection() {
    return (React.createElement(React.Fragment, null,
        React.createElement(DatasetSearchBox, null),
        React.createElement(Row, { className: "mt-4" },
            React.createElement(DatasetEntries, { headerIcon: "fas fa-database", headerText: "Predefined Sets", entries: predefinedSets, readonly: true }),
            React.createElement(DatasetEntries, { headerIcon: "fas fa-user", headerText: "My Sets", entries: privateSets }),
            React.createElement(DatasetEntries, { headerIcon: "fas fa-users", headerText: "Public Sets", entries: publicSets, readonly: true }))));
}
//# sourceMappingURL=DatasetSection.js.map