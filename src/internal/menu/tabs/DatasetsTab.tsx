import React, {useMemo} from 'react';
import {Container, Col, Nav, Row, Button} from 'react-bootstrap';
import {Link, Element} from 'react-scroll';
import {PluginRegistry, UniqueIdManager} from 'phovea_core';
import {UploadDatasetCard} from '../../components';
import {IDataSourceConfig} from '../../../../../tdp_publicdb/dist/common/config';
import {EXTENSION_POINT_STARTMENU_DATASET, IStartMenuDatasetDesc, IStartMenuSectionDesc} from '../../..';
import {useAsync} from '../../../hooks';

export interface IStartMenuSectionTab {
  id: string;
  tabText: string;
  tabIcon: string;
}

export function DatasetsTab() {
  const suffix = UniqueIdManager.getInstance().uniqueId();
  const loadCards = useMemo(() => () => {
    const sectionEntries = PluginRegistry.getInstance().listPlugins(EXTENSION_POINT_STARTMENU_DATASET).map((d) => d as IStartMenuDatasetDesc);
    return Promise.all(sectionEntries.map((section) => section.load()));
  }, []);
  const {status, value: cards} = useAsync(loadCards);

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
        {status === 'success' ?
          cards.map((card) => {
            return (
              <Link key={card.desc.id} className="nav-link" role="button" to={`${card.desc.id}_${suffix}`} spy={true} smooth={true} offset={-250} duration={500}>{card.desc.name}</Link>
            );
          }) : null}
        <Link className="nav-link" role="button" to={`upload_${suffix}`} spy={true} smooth={true} offset={-250} duration={500}>Upload</Link>
      </Nav>
      <Container className="mb-4 datasets-tab">
        <Row>
          <Col>
            <Element>
              <p className="ordino-info-text">Start a new analysis session by loading a dataset</p>
            </Element>
            {status === 'success' ?
              cards.map((card) => {
                return (
                  <Element key={card.desc.id} className="pt-6" name={`${card.desc.id}_${suffix}`}>
                    <card.factory key={card.desc.id} {...card.desc} />
                  </Element>
                );
              }) : null}
            <Element className="py-6" name={`upload_${suffix}`}>
              <UploadDatasetCard id="upload" headerText="Upload" headerIcon="fas fa-file-upload"></UploadDatasetCard>
            </Element>
          </Col>
        </Row>
      </Container>
    </>
  );
}
