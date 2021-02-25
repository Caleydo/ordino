import React from 'react';
import { Card, Nav, Tab, Row } from 'react-bootstrap';
import { DatasetSearchBox } from './DatasetSearchBox';
import { ENamedSetType, RestBaseUtils, RestStorageUtils } from 'tdp_core';
import { NamedSetList } from './NamedSetList';
export function DatasetCard({ headerText, headerIcon, database, dbViewBase, idType, tabs }) {
    const subTypeKey = 'species';
    function loadPredefinedSet(species) {
        return () => RestBaseUtils.getTDPData(database, `${dbViewBase}_panel`)
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
    function loadNamedSets(species) {
        return () => RestStorageUtils.listNamedSets(idType)
            .then((namedSets) => {
            return namedSets.filter((namedSet) => namedSet.subTypeKey === subTypeKey && namedSet.subTypeValue === species);
        });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left mt-4 mb-3" },
            React.createElement("i", { className: 'mr-2 ordino-icon-2 ' + headerIcon }),
            " ",
            headerText),
        React.createElement(Card, { className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                React.createElement(Tab.Container, { defaultActiveKey: tabs[0].id },
                    React.createElement(Nav, { className: "session-tab", variant: "pills" }, tabs.map((tab) => {
                        return (React.createElement(Nav.Item, { key: tab.id },
                            React.createElement(Nav.Link, { eventKey: tab.id },
                                React.createElement("i", { className: 'mr-2 ' + tab.tabIcon }),
                                tab.tabText)));
                    })),
                    React.createElement(Tab.Content, null, tabs.map((tab) => {
                        return (React.createElement(Tab.Pane, { key: tab.id, eventKey: tab.id, className: "mt-4" },
                            React.createElement(DatasetSearchBox, null),
                            React.createElement(Row, { className: "mt-4" },
                                React.createElement(NamedSetList, { headerIcon: "fas fa-database", headerText: "Predefined Sets", loadEntries: loadPredefinedSet(tab.id), readonly: true }),
                                React.createElement(NamedSetList, { headerIcon: "fas fa-user", headerText: "My Sets", loadEntries: loadNamedSets(tab.id) }),
                                React.createElement(NamedSetList, { headerIcon: "fas fa-users", headerText: "Public Sets", loadEntries: loadNamedSets(tab.id), readonly: true }))));
                    })))))));
}
//# sourceMappingURL=DatasetCard.js.map