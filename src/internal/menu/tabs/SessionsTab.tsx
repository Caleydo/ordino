import React, {useMemo} from 'react';
import {Container, Col, Nav, Row, Button} from 'react-bootstrap';
import {Link, Element} from 'react-scroll';
import {PluginRegistry, UniqueIdManager} from 'phovea_core';
import {useAsync} from '../../../hooks';
import {EP_ORDINO_STARTMENU_SESSION_SECTION, IStartMenuSessionSectionDesc} from '../../..';
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
        <>
          <Nav className="scrollspy-nav flex-column ml-4">
            {
              sections?.map((section) => <Link className="nav-link" key={section.desc.id} role="button" to={`${section.desc.id}-${suffix}`} spy={true} smooth={true} offset={-300} duration={500}>{section.desc.name}</Link>)
            }
          </Nav>
          <Container className="mb-4 analysis-tab">
            <Row>
              <Col>
                {
                  sections?.map((section, i) => {
                    return (<Element className={`${i === 0 || 'pt-6'}`} key={section.desc.id} name={`${section.desc.id}-${suffix}`}>
                      <section.factory {...section.desc} />
                    </Element>);
                  })}
              </Col>
            </Row>
          </Container>
        </>
        : null}
    </>
  );
}
