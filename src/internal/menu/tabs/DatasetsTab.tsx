import React from 'react';
import {Container, Col, Nav, Row, Button} from 'react-bootstrap';
import {Link, Element} from 'react-scroll';
import {UniqueIdManager} from 'phovea_core';
import {DatasetCard, UploadDatasetCard} from '../../components';
import {IDataSourceConfig} from '../../../../../tdp_publicdb/dist/common/config';
import {gene, cellline, tissue} from 'tdp_publicdb/dist/common/config';


export interface IStartMenuCard {
  id: string;
  headerText: string;
  headerIcon: string;
  datasource: IDataSourceConfig;
  // TODO temporary fix
  dbViewSuffix: string;
  tabs: IStartMenuSectionTab[];
}


export interface IStartMenuSectionTab {
  id: string;
  tabText: string;
  tabIcon: string;
}

export function DatasetsTab() {
  const suffix = UniqueIdManager.getInstance().uniqueId();

  //  cards, setCards to load the cards from extension point
  // React.useEffect(() => {
  //   Registry.listPlugins
  // }, [])


  // TODO generate from extension point
  const cards: IStartMenuCard[] = [
    {
      id: 'genes',
      headerText: 'Genes',
      headerIcon: 'fas fa-database',
      dbViewSuffix: `_gene_items`,
      datasource: gene,
      tabs: [
        {id: 'human', tabText: 'Human', tabIcon: 'fas fa-male'},
        {id: 'mouse', tabText: 'Mouse', tabIcon: 'fas fa-fw mouse-icon'}
      ]
    },
    {
      id: 'celllines',
      headerText: 'Cell Lines',
      headerIcon: 'fas fa-database',
      dbViewSuffix: `_items`,
      datasource: cellline,
      tabs: [
        {id: 'human', tabText: 'Human', tabIcon: 'fas fa-male'},
        {id: 'mouse', tabText: 'Mouse', tabIcon: 'fas fa-fw mouse-icon'}
      ]
    },
    {
      id: 'tissues',
      headerText: 'Tissues',
      headerIcon: 'fas fa-database',
      datasource: tissue,
      dbViewSuffix: `_items`,
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
