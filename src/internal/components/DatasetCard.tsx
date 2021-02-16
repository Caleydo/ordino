import React from 'react';
import {Card, Nav, Tab} from 'react-bootstrap';
import {DatasetSection} from './DatasetSection';

// interface IDatasetTab {
//   id: string;
//   title: string;
// }

interface IDatasetCardProps {
  id: string;
  title: string;
  faIcon: string;
  // tabs: IDatasetTab[];
}

export function DatasetCard({title, faIcon}: IDatasetCardProps) {
  return (
      <>
          <h4 className="text-left mt-4 mb-3"><i className={'mr-2 ordino-icon-2 ' + faIcon}></i> {title}</h4>
          <Card className="shadow-sm">
              <Card.Body className="p-3">
                  <Tab.Container defaultActiveKey="human">
                      <Nav className="session-tab" variant="pills" >
                          <Nav.Item >
                              <Nav.Link eventKey="human"><i className="mr-2 fas fa-male"></i>Human</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                              <Nav.Link disabled eventKey="mouse"> <i className="mr-2 fa fa-fw mouse-icon"></i>Mouse</Nav.Link>
                          </Nav.Item>
                      </Nav>
                      <Tab.Content>
                          <Tab.Pane eventKey="human" className="mt-4">
                              <DatasetSection />
                          </Tab.Pane>
                      </Tab.Content>
                  </Tab.Container>
              </Card.Body>
          </Card>
      </>
  );
}
