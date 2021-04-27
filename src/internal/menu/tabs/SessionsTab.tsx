import React, {useMemo} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import {InView} from 'react-intersection-observer';
import {PluginRegistry, UniqueIdManager} from 'phovea_core';
import {useAsync} from '../../../hooks';
import {EP_ORDINO_STARTMENU_SESSION_SECTION, IStartMenuSessionSectionDesc} from '../../..';
import {OrdinoScrollspy} from '../../components';
import {BrowserRouter} from 'react-router-dom';
import {OrdinoFooter} from '../../../components';

function byPriority(a: any, b: any) {
  return (a.priority || 10) - (b.priority || 10);
}

export function SessionsTab() {
  const suffix = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);

  const loadSections = useMemo(() => () => {
    const sectionEntries = PluginRegistry.getInstance().listPlugins(EP_ORDINO_STARTMENU_SESSION_SECTION).map((d) => d as IStartMenuSessionSectionDesc).sort(byPriority);
    return Promise.all(sectionEntries.map((section) => section.load()));
  }, []);

  const {status, value: items} = useAsync(loadSections);

  return (
    <>
      {status === 'success' ?
        <OrdinoScrollspy items={items.map((item) => ({id: `${item.desc.id}_${suffix}`, name: item.desc.name}))}>
          {(handleOnChange) =>
            <>
              <Container className="pb-10 pt-5">
                <Row>
                  <Col>
                    {items?.map((item, index) => {
                      return (
                        // `id` attribute must match the one in the scrollspy
                        <InView as="div" className={`${(index > 0) ? 'pt-3' : ''} ${(index < items.length - 1) ? 'pb-5' : ''}`} id={`${item.desc.id}_${suffix}`} key={item.desc.id} onChange={(inView: boolean, entry: IntersectionObserverEntry) => handleOnChange(`${item.desc.id}_${suffix}`, inView, entry)}>
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
        </OrdinoScrollspy>
        : null}
    </>
  );
}
