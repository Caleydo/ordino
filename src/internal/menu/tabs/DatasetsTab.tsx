import React, {useMemo} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import {PluginRegistry, UniqueIdManager} from 'phovea_core';
import {OrdinoScrollspy} from '../../components';
import {EP_ORDINO_STARTMENU_DATASET_SECTION, IStartMenuDatasetSectionDesc} from '../../..';
import {useAsync} from '../../../hooks';
import {BrowserRouter} from 'react-router-dom';
import {OrdinoFooter} from '../../../components';

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
        <OrdinoScrollspy items={cards.map((card) => ({id: `${card.desc.id}_${suffix}`, name: card.desc.name}))}>
            <Container className="pb-10 pt-5">
              <Row>
                <Col>
                  <p className="lead text-ordino-gray-4 mb-0">Start a new analysis session by loading a dataset</p>
                  {cards.map((card) => {
                    return (
                      // `id` attribute must match the one in the scrollspy
                      <div key={card.desc.id} className="pt-3 pb-5" id={`${card.desc.id}_${suffix}`}>
                        <card.factory key={card.desc.id} {...card.desc} />
                      </div>
                    );
                  })}
                </Col>
              </Row>
            </Container>
            <BrowserRouter basename="/#">
              <OrdinoFooter openInNewWindow />
            </BrowserRouter>
        </OrdinoScrollspy> : null}
    </>
  );
}
