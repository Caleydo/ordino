import React from 'react';
import {Card, Nav, Tab} from 'react-bootstrap';
import {DatasetDropzone} from './DatasetDropzone';
import {UploadDatasetListItem} from './UploadDatasetListItem';

interface IUploadDatasetCardProps {
  id: string;
  headerText: string;
  headerIcon: string;
}

export function UploadDatasetCard({headerText, headerIcon}: IUploadDatasetCardProps) {
  return (
      <>
          <h4 className="text-left mt-4 mb-3"><i className={'mr-2 ordino-icon-2 ' + headerIcon}></i> {headerText}</h4>
          <Card className="shadow-sm">
              <Card.Body className="p-3">
                  <DatasetDropzone />
                  <Tab.Container defaultActiveKey="myDatasets">
                      <Nav className="session-tab mt-4" variant="pills">
                          <Nav.Item >
                              <Nav.Link eventKey="myDatasets"><i className="mr-2 fas fa-user"></i>My Datasets</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                              <Nav.Link eventKey="publicDatasets"> <i className="mr-2 fas fa-users"></i>Public Datasets</Nav.Link>
                          </Nav.Item>
                      </Nav>
                      <Tab.Content>
                          <Tab.Pane eventKey="myDatasets" className="mt-4">
                              <UploadDatasetListItem accessType="public" name="anylysis_dataset" uploadedDate="Mon, 10 Aug 2020" />
                              <UploadDatasetListItem accessType="private" name="crispr_dataset" uploadedDate="Mon, 10 Sep 2020" description="This is an optional description for the dataset file" />
                              <UploadDatasetListItem accessType="public" uploadedDate="Mon, 10 Nov 2020" name="crispr_dataset" />
                          </Tab.Pane>
                          <Tab.Pane eventKey="publicDatasets" className="mt-4" >
                              <UploadDatasetListItem accessType="public" name="crispr_dataset" uploadedDate="Mon, 10 Aug 2020" />
                          </Tab.Pane>
                      </Tab.Content>
                  </Tab.Container>
              </Card.Body>
          </Card>
      </>
  );
}
