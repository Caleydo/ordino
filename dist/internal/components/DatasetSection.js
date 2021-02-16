import React from 'react';
import { Row } from 'react-bootstrap';
import { DatasetSearchBox } from './DatasetSearchBox';
import { ENamedSetType, RestBaseUtils, RestStorageUtils } from 'tdp_core';
import { NamedSetList } from './NamedSetList';
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
            React.createElement(NamedSetList, { headerIcon: "fas fa-database", headerText: "Predefined Sets", loadEntries: loadPredefinedSet, readonly: true }),
            React.createElement(NamedSetList, { headerIcon: "fas fa-user", headerText: "My Sets", loadEntries: loadNamedSets }),
            React.createElement(NamedSetList, { headerIcon: "fas fa-users", headerText: "Public Sets", loadEntries: loadNamedSets, readonly: true }))));
}
//# sourceMappingURL=DatasetSection.js.map