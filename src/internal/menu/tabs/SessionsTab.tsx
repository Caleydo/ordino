import React, {useMemo} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
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
  const suffix = UniqueIdManager.getInstance().uniqueId();

  const loadSections = useMemo(() => () => {
    const sectionEntries = PluginRegistry.getInstance().listPlugins(EP_ORDINO_STARTMENU_SESSION_SECTION).map((d) => d as IStartMenuSessionSectionDesc).sort(byPriority);
    return Promise.all(sectionEntries.map((section) => section.load()));
  }, []);

  const {status, value: sections} = useAsync(loadSections);

  return (
    <>
      {status === 'success' ?
        <OrdinoScrollspy items={sections.map((section) => ({id: `${section.desc.id}_${suffix}`, name: section.desc.name}))}>
          <Container className="pb-10 pt-5">
            <Row>
              <Col>
                {sections?.map((section, index) => {
                  return (
                    // `id` attribute must match the one in the scrollspy
                    <div id={`${section.desc.id}_${suffix}`} className={`${(index > 0) ? 'pt-3' : ''} ${(index < sections.length - 1) ? 'pb-5' : ''}`} key={section.desc.id}>
                      <section.factory {...section.desc} />
                    </div>
                  );
                })}
              </Col>
            </Row>
          </Container>
          <BrowserRouter basename="/#">
            <OrdinoFooter openInNewWindow />
          </BrowserRouter>
        </OrdinoScrollspy>
        : null}
    </>
  );
}
