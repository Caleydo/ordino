import React from 'react';
import { Button, ButtonGroup, Col, Dropdown, Row, } from 'react-bootstrap';
import { DatasetSearchBox } from './DatasetSearchBox';
import { useAsync } from '../../hooks';
import { ENamedSetType, RestBaseUtils, RestStorageUtils } from 'tdp_core';
function DatasetEntries({ headerIcon, headerText, loadEntries, readonly }) {
    const { status, value, error } = useAsync(loadEntries);
    return (React.createElement(Col, { md: 4, className: "dataset-entry d-flex flex-column" },
        React.createElement("header", null,
            React.createElement("i", { className: `mr-2 ${headerIcon}` }),
            headerText),
        status === 'success' &&
            React.createElement(ButtonGroup, { vertical: true }, value.map((entry, i) => {
                return (React.createElement(ButtonGroup, { key: i, className: "dropdown-parent justify-content-between" },
                    React.createElement(Button, { className: "text-left pl-0", style: { color: '#337AB7' }, variant: "link" }, entry.name),
                    readonly ||
                        React.createElement(DatasetEntryDropdown, null,
                            React.createElement(Dropdown.Item, null, "Edit"),
                            React.createElement(Dropdown.Item, { className: "dropdown-delete" }, "Delete"))));
            })),
        status === 'error' && React.createElement("div", null, error)));
}
export function DatasetEntryDropdown(props) {
    return (React.createElement(Dropdown, { vertical: true, className: "session-dropdown", as: ButtonGroup },
        React.createElement(Dropdown.Toggle, { variant: "link" },
            React.createElement("i", { className: "fas fa-ellipsis-v " })),
        React.createElement(Dropdown.Menu, null, props.children)));
}
export function DatasetSection({ species, idType, database, dbViewBase }) {
    const subTypeKey = 'species';
    function loadPredefinedSet() {
        return RestBaseUtils.getTDPData(database, `${dbViewBase}_panel`)
            .then((panels) => {
            return panels
                .filter((panel) => panel.species === species)
                .map(function panel2NamedSet({ id, description, species }) {
                return {
                    type: ENamedSetType.PANEL,
                    id,
                    name: id,
                    description,
                    subTypeKey,
                    subTypeFromSession: false,
                    subTypeValue: species,
                    idType: ''
                };
            });
        });
    }
    function loadNamedSets() {
        return RestStorageUtils.listNamedSets(idType)
            .then((namedSets) => {
            return namedSets.filter((namedSet) => namedSet.subTypeKey === subTypeKey && namedSet.subTypeValue === species);
        });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(DatasetSearchBox, null),
        React.createElement(Row, { className: "mt-4" },
            React.createElement(DatasetEntries, { headerIcon: "fas fa-database", headerText: "Predefined Sets", loadEntries: loadPredefinedSet, readonly: true }),
            React.createElement(DatasetEntries, { headerIcon: "fas fa-user", headerText: "My Sets", loadEntries: loadNamedSets }),
            React.createElement(DatasetEntries, { headerIcon: "fas fa-users", headerText: "Public Sets", loadEntries: loadNamedSets, readonly: true }))));
}
//# sourceMappingURL=DatasetSection.js.map