import React from 'react';
import { Card, Nav, Tab, Row } from 'react-bootstrap';
import { DatasetSearchBox } from './DatasetSearchBox';
import { ENamedSetType, RestBaseUtils, RestStorageUtils } from 'tdp_core';
import { NamedSetList } from './NamedSetList';
import { useAsync } from '../../../hooks';
import { UserSession } from 'phovea_core';
export function DatasetCard({ headerText, headerIcon, database, dbViewBase, idType, tabs }) {
    const subTypeKey = 'species';
    const loadPredefinedSet = React.useMemo(() => {
        return () => RestBaseUtils.getTDPData(database, `${dbViewBase}_panel`)
            .then((panels) => {
            return panels
                // .filter((panel) => panel.species === species) // filter is done below in the JSX code
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
    }, [database, dbViewBase, idType]);
    const loadNamedSets = React.useMemo(() => {
        return () => RestStorageUtils.listNamedSets(idType);
    }, [database, dbViewBase, idType]);
    const predefinedNamedSets = useAsync(loadPredefinedSet);
    const me = UserSession.getInstance().currentUserNameOrAnonymous();
    const namedSets = useAsync(loadNamedSets);
    const myNamedSets = { ...namedSets, ...{ value: namedSets.value.filter((d) => d.type === ENamedSetType.NAMEDSET && d.creator === me) } };
    const publicNamedSets = { ...namedSets, ...{ value: namedSets.value.filter((d) => d.type === ENamedSetType.NAMEDSET && d.creator !== me) } };
    const filterValue = (value, tab) => value === null || value === void 0 ? void 0 : value.filter((entry) => entry.subTypeValue === tab);
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
                                React.createElement(NamedSetList, { headerIcon: "fas fa-database", headerText: "Predefined Sets", status: predefinedNamedSets.status, error: predefinedNamedSets.error, value: filterValue(predefinedNamedSets.value, tab.id), readonly: true }),
                                React.createElement(NamedSetList, { headerIcon: "fas fa-user", headerText: "My Sets", status: myNamedSets.status, error: myNamedSets.error, value: filterValue(myNamedSets.value, tab.id) }),
                                React.createElement(NamedSetList, { headerIcon: "fas fa-users", headerText: "Public Sets", status: publicNamedSets.status, error: publicNamedSets.error, value: filterValue(publicNamedSets.value, tab.id), readonly: true }))));
                    })))))));
}
//# sourceMappingURL=DatasetCard.js.map