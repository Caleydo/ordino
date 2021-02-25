import React from 'react';
import {Container, Col, Nav, Row, Button} from 'react-bootstrap';
import {Link, Element} from 'react-scroll';
import {UniqueIdManager} from 'phovea_core';
import {DatasetCard, UploadDatasetCard} from '../../components';


export function DatasetsTab() {
  const suffix = UniqueIdManager.getInstance().uniqueId();

  const cards = [
    {
      id: 'genes',
      idType: 'Ensembl',
      headerText: 'Genes',
      headerIcon: 'fas fa-database',
      database: 'publicdb',
      dbViewBase: 'gene',
      tabs: [
        {id: 'human', tabText: 'Human', tabIcon: 'fas fa-male'},
        {id: 'mouse', tabText: 'Mouse', tabIcon: 'fas fa-fw mouse-icon'}
      ]
    },
    {
      id: 'celllines',
      idType: 'Cellline',
      headerText: 'Cell Lines',
      headerIcon: 'fas fa-database',
      database: 'publicdb',
      dbViewBase: 'cellline',
      tabs: [
        {id: 'human', tabText: 'Human', tabIcon: 'fas fa-male'},
        {id: 'mouse', tabText: 'Mouse', tabIcon: 'fas fa-fw mouse-icon'}
      ]
    },
    {
      id: 'tissues',
      idType: 'Tissue',
      headerText: 'Tissues',
      headerIcon: 'fas fa-database',
      database: 'publicdb',
      dbViewBase: 'tissue',
      tabs: [
        {id: 'human', tabText: 'Human', tabIcon: 'fas fa-male'},
        // {id: 'mouse', tabText: 'Mouse', tabIcon: 'fas fa-fw mouse-icon'}
      ]
    },
    // {
    //   id: 'upload',
    //   headerText: 'Upload',
    //   headerIcon: 'fas fa-file-upload'
    // }
  ];

  return (
    <>
      <Row>
        <Col className="d-flex justify-content-end">
          <Button className="start-menu-close" variant="link">
            <i className="fas fa-times"></i>
          </Button>
        </Col>
      </Row>
      <Nav className="scrollspy-nav flex-column ml-4">
        {cards.map((card) => {
          return (
            <Link key={card.id} className="nav-link" role="button" to={`${card.id}_${suffix}`} spy={true} smooth={true} offset={-250} duration={500}>{card.headerText}</Link>
          );
        })}
        <Link className="nav-link" role="button" to={`upload_${suffix}`} spy={true} smooth={true} offset={-250} duration={500}>Upload</Link>
      </Nav>
      <Container className="mb-4 datasets-tab">
        <Row>
          <Col>
            <Element>
              <p className="ordino-info-text">Start a new analysis session by loading a dataset</p>
            </Element>
            {cards.map((card) => {
              return (
                <Element key={card.id} className="pt-6" name={`${card.id}_${suffix}`}>
                  <DatasetCard key={card.id} {...card}></DatasetCard>
                </Element>
              );
            })}
            <Element className="py-6" name={`upload_${suffix}`}>
              <UploadDatasetCard id="upload" headerText="Upload" headerIcon="fas fa-file-upload"></UploadDatasetCard>
            </Element>
          </Col>
        </Row>
      </Container>
    </>
  );
}
