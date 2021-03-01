import React from 'react';
import { Card, Nav, Tab, Row } from 'react-bootstrap';
import { DatasetSearchBox } from './DatasetSearchBox';
import { ENamedSetType, RestBaseUtils, RestStorageUtils } from 'tdp_core';
import { NamedSetList } from './NamedSetList';
import { useAsync } from '../../../hooks';
import { UserSession } from 'phovea_core';
export function DatasetCard({ headerText, headerIcon, tabs, dbViewSuffix, datasource }) {
    var _a, _b;
    const subTypeKey = 'species';
    const loadPredefinedSet = React.useMemo(() => {
        return () => RestBaseUtils.getTDPData(datasource.db, `${datasource.base}_panel`)
            .then((panels) => {
            return panels
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
    }, [datasource.db, datasource.base, datasource.idType]);
    const loadNamedSets = React.useMemo(() => {
        return () => RestStorageUtils.listNamedSets(datasource.idType);
    }, [datasource.db, datasource.base, datasource.idType]);
    const predefinedNamedSets = useAsync(loadPredefinedSet);
    const me = UserSession.getInstance().currentUserNameOrAnonymous();
    const namedSets = useAsync(loadNamedSets);
    const myNamedSets = { ...namedSets, ...{ value: (_a = namedSets.value) === null || _a === void 0 ? void 0 : _a.filter((d) => d.type === ENamedSetType.NAMEDSET && d.creator === me) } };
    const publicNamedSets = { ...namedSets, ...{ value: (_b = namedSets.value) === null || _b === void 0 ? void 0 : _b.filter((d) => d.type === ENamedSetType.NAMEDSET && d.creator !== me) } };
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
                            React.createElement(DatasetSearchBox, Object.assign({ placeholder: `Add ${headerText}` }, datasource, { dbViewSuffix: dbViewSuffix })),
                            React.createElement(Row, { className: "mt-4" },
                                React.createElement(NamedSetList, { headerIcon: "fas fa-database", headerText: "Predefined Sets", status: predefinedNamedSets.status, error: predefinedNamedSets.error, value: filterValue(predefinedNamedSets.value, tab.id), readonly: true }),
                                React.createElement(NamedSetList, { headerIcon: "fas fa-user", headerText: "My Sets", status: myNamedSets.status, error: myNamedSets.error, value: filterValue(myNamedSets.value, tab.id) }),
                                React.createElement(NamedSetList, { headerIcon: "fas fa-users", headerText: "Public Sets", status: publicNamedSets.status, error: publicNamedSets.error, value: filterValue(publicNamedSets.value, tab.id), readonly: true }))));
                    })))))));
}
//# sourceMappingURL=DatasetCard.js.map