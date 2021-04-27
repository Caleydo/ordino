import React, {useMemo} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import {InView} from 'react-intersection-observer';
import {PluginRegistry, UniqueIdManager} from 'phovea_core';
import {OrdinoScrollspy} from '../../components';
import {EP_ORDINO_STARTMENU_DATASET_SECTION, IStartMenuDatasetSectionDesc} from '../../..';
import {useAsync} from '../../../hooks';
import {BrowserRouter} from 'react-router-dom';
import {OrdinoFooter} from '../../../components';

export function DatasetsTab() {
  const suffix = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);

  const loadCards = useMemo(() => () => {
    const sectionEntries = PluginRegistry.getInstance().listPlugins(EP_ORDINO_STARTMENU_DATASET_SECTION).map((d) => d as IStartMenuDatasetSectionDesc);
    return Promise.all(sectionEntries.map((section) => section.load()));
  }, []);

  const {status, value: items} = useAsync(loadCards);

  return (
    <>
      {status === 'success' ?
        <OrdinoScrollspy items={items.map((card) => ({id: `${card.desc.id}_${suffix}`, name: card.desc.name}))}>
          {(handleOnChange) =>
            <>
              <Container className="pb-10 pt-5">
                <Row>
                  <Col>
                    <p className="lead text-ordino-gray-4 mb-0">Start a new analysis session by loading a dataset</p>
                    {items.map((item) => {
                      return (
                        // `id` attribute must match the one in the scrollspy
                        <InView as="div" className="pt-3 pb-5" id={`${item.desc.id}_${suffix}`} key={item.desc.id} onChange={(inView: boolean, entry: IntersectionObserverEntry) => handleOnChange(`${item.desc.id}_${suffix}`, inView, entry)}>
                          <item.factory {...item.desc} />
                        </InView>
                      );
                    })}
                  </Col>
                </Row>
              </Container>
              <BrowserRouter basename="/#">
                <OrdinoFooter openInNewWindow />
              </BrowserRouter>
            </>
          }
        </OrdinoScrollspy> : null}
    </>
  );
}
