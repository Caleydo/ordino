import React, {useMemo} from 'react';
import {Container, Col, Nav, Row, ListGroup} from 'react-bootstrap';
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

  /**
   * Get the href attribute and find the corresponding element with the id.
   * If found scroll the element into the viewport.
   * @param evt Click event
   */
  const scrollIntoView = (evt) => {
    evt.preventDefault(); // prevent jumping to element with id and scroll smoothly instead
    document.querySelector(evt.currentTarget.getAttribute('href'))?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    return false;
  };

  return (
    <>
      {status === 'success' ?
        <>
          <ListGroup variant="flush" id="datasets-tab-scrollspy-nav" className="scrollspy-nav flex-column ml-4">
            {cards.map((card) => {
              return (
                // Important: We cannot use the react-bootstrap `ListGroup.Item` here, because it sets the `active` class automatically at `onClick`.
                // This behavior cannot be supressed and interfers with the Bootstrap scrollspy + `scrollIntoView` which causes a flickering of the navigation items.
                // The only solution is to use a plain `a` element and add the necessary Bootstrap classes here.
                // <ListGroup.Item key={card.desc.id} action href={`#${card.desc.id}_${suffix}`} onClick={scrollIntoView} className="pl-0 mt-0 border-0 bg-transparent">{card.desc.name}</ListGroup.Item>
                <a key={card.desc.id} href={`#${card.desc.id}_${suffix}`} onClick={scrollIntoView} className="pl-0 mt-0 border-0 bg-transparent list-group-item list-group-item-action">{card.desc.name}</a>
              );
            })}
            {/* <ListGroup.Item action href={`#upload_${suffix}`} onClick={scrollIntoView} className="pl-0 mt-0 border-0 bg-transparent">Upload</ListGroup.Item> */}
            <a href={`#upload_${suffix}`} onClick={scrollIntoView} className="pl-0 mt-0 border-0 bg-transparent list-group-item list-group-item-action">Upload</a>
          </ListGroup>
          <Container className="mb-4">
            <Row>
              <Col>
                <p className="lead text-ordino-gray-4 mb-0">Start a new analysis session by loading a dataset</p>
                {cards.map((card) => {
                  return (
                    <div key={card.desc.id} className="pt-3 pb-5" id={`${card.desc.id}_${suffix}`}>
                      <card.factory key={card.desc.id} {...card.desc} />
                    </div>
                  );
                })}
                <div className="pt-3" id={`upload_${suffix}`}>
                  <UploadDatasetCard id="upload" headerText="Upload" headerIcon="fas fa-file-upload"></UploadDatasetCard>
                </div>
              </Col>
            </Row>
          </Container>
        </> : null}
    </>
  );
}
