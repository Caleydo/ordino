import React from 'react';
import {Card, Nav, Tab, Row} from 'react-bootstrap';
import {DatasetSearchBox} from './DatasetSearchBox';
import {INamedSet, IStoredNamedSet, ENamedSetType, RestBaseUtils, RestStorageUtils} from 'tdp_core';
import {NamedSetList} from './NamedSetList';

interface IDatasetTab {
  id: string;
  tabText: string;
  tabIcon: string;
}

interface IDatasetCardProps {
  id: string;

  headerText: string;

  headerIcon: string;

  database: string;

  dbViewBase: string;

  idType: string;

  tabs: IDatasetTab[];
}

export function DatasetCard({headerText, headerIcon, database, dbViewBase, idType, tabs}: IDatasetCardProps) {
  const subTypeKey = 'species';

  function loadPredefinedSet(species: string) {
    return () => RestBaseUtils.getTDPData(database, `${dbViewBase}_panel`)
    .then((panels: { id: string, description: string, species: string }[]) => {
      return panels
        .filter((panel) => panel.species === species)
        .map(function panel2NamedSet({id, description, species}): INamedSet {
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

  function loadNamedSets(species: string) {
    return () => RestStorageUtils.listNamedSets(idType)
      .then((namedSets: IStoredNamedSet[]) => {
        return namedSets.filter((namedSet) => namedSet.subTypeKey === subTypeKey && namedSet.subTypeValue === species);
      });
  }

  return (
    <>
      <h4 className="text-left mt-4 mb-3"><i className={'mr-2 ordino-icon-2 ' + headerIcon}></i> {headerText}</h4>
      <Card className="shadow-sm">
        <Card.Body className="p-3">
          <Tab.Container defaultActiveKey={tabs[0].id}>
            <Nav className="session-tab" variant="pills">
              {tabs.map((tab) => {
                return (
                  <Nav.Item key={tab.id}>
                    <Nav.Link eventKey={tab.id}><i className={'mr-2 ' + tab.tabIcon}></i>{tab.tabText}</Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
            <Tab.Content>
              {tabs.map((tab) => {
                return (
                  <Tab.Pane key={tab.id} eventKey={tab.id} className="mt-4">
                    <DatasetSearchBox></DatasetSearchBox>
                    <Row className="mt-4">
                      <NamedSetList headerIcon="fas fa-database" headerText="Predefined Sets" loadEntries={loadPredefinedSet(tab.id)} readonly />
                      <NamedSetList headerIcon="fas fa-user" headerText="My Sets" loadEntries={loadNamedSets(tab.id)} />
                      <NamedSetList headerIcon="fas fa-users" headerText="Public Sets" loadEntries={loadNamedSets(tab.id)} readonly />
                    </Row>
                  </Tab.Pane>
                );
              })}
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </>
  );
}
