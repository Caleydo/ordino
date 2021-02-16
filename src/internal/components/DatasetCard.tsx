import React from 'react';
import {Card, Nav, Tab} from 'react-bootstrap';
import {DatasetSection} from './DatasetSection';

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
                    <DatasetSection species={tab.id} idType={idType} database={database} dbViewBase={dbViewBase} />
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
