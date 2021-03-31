import React, {useMemo} from 'react';
import {Container, Col, Nav, Row} from 'react-bootstrap';
import {Link, Element} from 'react-scroll';
import {PluginRegistry, UniqueIdManager} from 'phovea_core';
import {UploadDatasetCard} from '../../components';
import {EP_ORDINO_STARTMENU_DATASET_SECTION, IStartMenuDatasetSectionDesc} from '../../..';
import {useAsync} from '../../../hooks';

export interface IStartMenuDatasetSectionTab {
  id: string;
  tabText: string;
  tabIcon: string;
}

export function DatasetsTab() {
  const suffix = UniqueIdManager.getInstance().uniqueId();
  const loadCards = useMemo(() => () => {
    const sectionEntries = PluginRegistry.getInstance().listPlugins(EP_ORDINO_STARTMENU_DATASET_SECTION).map((d) => d as IStartMenuDatasetSectionDesc);
    return Promise.all(sectionEntries.map((section) => section.load()));
  }, []);
  const {status, value: cards} = useAsync(loadCards);

  return (
    <>
      {status === 'success' ?
        <>
          <Nav className="scrollspy-nav flex-column ml-4">
            {cards.map((card) => {
              return (
                <Link key={card.desc.id} className="nav-link" role="button" to={`${card.desc.id}_${suffix}`} spy={true} smooth={true} duration={500} containerId="ordino-start-menu">{card.desc.name}</Link>
              );
            })}
            <Link className="nav-link" role="button" to={`upload_${suffix}`} spy={true} smooth={true} duration={500} containerId="ordino-start-menu">Upload</Link>
          </Nav>
          <Container className="mb-4">
            <Row>
              <Col>
                <p className="lead text-ordino-gray-4">Start a new analysis session by loading a dataset</p>
                {cards.map((card, index) => {
                  return (
                    <Element key={card.desc.id} className={index > 0 ? 'pt-6' : ''} name={`${card.desc.id}_${suffix}`}>
                      <card.factory key={card.desc.id} {...card.desc} />
                    </Element>
                  );
                })}
                <Element className="pt-6" name={`upload_${suffix}`}>
                  <UploadDatasetCard id="upload" headerText="Upload" headerIcon="fas fa-file-upload"></UploadDatasetCard>
                </Element>
              </Col>
            </Row>
          </Container>
        </> : null}
    </>
  );
}
