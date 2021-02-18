import React from 'react';
import {Card, Nav, Tab, Row} from 'react-bootstrap';
import {DatasetSearchBox} from './DatasetSearchBox';
import {INamedSet, ENamedSetType, RestBaseUtils} from 'tdp_core';
import {NamedSetList} from './NamedSetList';
import {useAsync} from '../../../hooks';

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

  const loadPredefinedSet = React.useMemo(() => {
    return () => RestBaseUtils.getTDPData(database, `${dbViewBase}_panel`)
      .then((panels: { id: string, description: string, species: string }[]) => {
        return panels
          // .filter((panel) => panel.species === species) // filter is done below in the JSX code
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
  }, [database, dbViewBase, idType]);

  // TODO: implement named sets
  // const loadNamedSets = React.useMemo(() => {
  //   return () => RestStorageUtils.listNamedSets(idType);
  // }, [database, dbViewBase, idType]);

  const { status, value, error } = useAsync<INamedSet[]>(loadPredefinedSet);
  // const { status, value, error } = useAsync<INamedSet[]>(loadNamedSets);

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
                // TODO: const filteredValue = value?.filter((entry) => entry.species === tab.id);
                const filteredValue = value;

                return (
                  <Tab.Pane key={tab.id} eventKey={tab.id} className="mt-4">
                    <DatasetSearchBox></DatasetSearchBox>
                    <Row className="mt-4">
                      <NamedSetList headerIcon="fas fa-database" headerText="Predefined Sets" status={status} error={error} value={filteredValue} readonly />
                      <NamedSetList headerIcon="fas fa-user" headerText="My Sets" status={status} error={error} value={filteredValue} />
                      <NamedSetList headerIcon="fas fa-users" headerText="Public Sets" status={status} error={error} value={filteredValue} readonly />
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
