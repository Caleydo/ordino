import React from 'react';
import {Card, Nav, Tab, Row} from 'react-bootstrap';
import {DatasetSearchBox} from './DatasetSearchBox';
import {INamedSet, ENamedSetType, RestBaseUtils, RestStorageUtils, IStoredNamedSet} from 'tdp_core';
import {NamedSetList} from './NamedSetList';
import {useAsync} from '../../../hooks';
import {UserSession} from 'phovea_core';
import {IStartMenuDatasetDesc} from '../../..';




export default function DatasetCard({name, headerIcon, tabs, viewId, datasource}: IStartMenuDatasetDesc) {
  const subTypeKey = 'species';

  const loadPredefinedSet = React.useMemo(() => {
    return () => RestBaseUtils.getTDPData(datasource.db, `${datasource.base}_panel`)
      .then((panels: {id: string, description: string, species: string}[]) => {
        return panels
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
  }, [datasource.db, datasource.base, datasource.idType]);

  const loadNamedSets = React.useMemo(() => {
    return () => RestStorageUtils.listNamedSets(datasource.idType);
  }, [datasource.db, datasource.base, datasource.idType]);

  const predefinedNamedSets = useAsync<INamedSet[], Error>(loadPredefinedSet);
  const me = UserSession.getInstance().currentUserNameOrAnonymous();
  const namedSets = useAsync<INamedSet[], Error>(loadNamedSets);
  const myNamedSets = {...namedSets, ...{value: namedSets.value?.filter((d) => d.type === ENamedSetType.NAMEDSET && d.creator === me)}};
  const publicNamedSets = {...namedSets, ...{value: namedSets.value?.filter((d) => d.type === ENamedSetType.NAMEDSET && d.creator !== me)}};
  const filterValue = (value: INamedSet[], tab: string) => value?.filter((entry) => entry.subTypeValue === tab);

  return (
    <>
      <h4 className="text-left mt-4 mb-3"><i className={'mr-2 ordino-icon-2 ' + headerIcon}></i> {name}</h4>
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
                    <DatasetSearchBox placeholder={`Add ${name}`} viewId={viewId} datasource={datasource} ></DatasetSearchBox>
                    <Row className="mt-4">
                      <NamedSetList headerIcon="fas fa-database" headerText="Predefined Sets" viewId={viewId} status={predefinedNamedSets.status} value={filterValue(predefinedNamedSets.value, tab.id)} readonly />
                      <NamedSetList headerIcon="fas fa-user" headerText="My Sets" viewId={viewId} status={myNamedSets.status} value={filterValue(myNamedSets.value, tab.id)} />
                      <NamedSetList headerIcon="fas fa-users" headerText="Public Sets" viewId={viewId} status={publicNamedSets.status} value={filterValue(publicNamedSets.value, tab.id)} readonly />
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
