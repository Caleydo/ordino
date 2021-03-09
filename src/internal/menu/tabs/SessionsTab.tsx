import React, {useMemo} from 'react';
import {Container, Col, Nav, Row, Button} from 'react-bootstrap';
import {Link, Element} from 'react-scroll';
import {PluginRegistry, UniqueIdManager} from 'phovea_core';
import {useAsync} from '../../../hooks';
import {EXTENSION_POINT_START_MENU, IStartMenuSectionDesc} from '../../..';



export function byDateDesc(a: any, b: any) {
  return -((a.ts || 0) - (b.ts || 0));
}

function byPriority(a: any, b: any) {
  return (a.priority || 10) - (b.priority || 10);
}

export function SessionsTab() {
  const suffix = UniqueIdManager.getInstance().uniqueId();
  const loadSections = useMemo(() => () => {
    const sectionEntries = PluginRegistry.getInstance().listPlugins(EXTENSION_POINT_START_MENU).map((d) => d as IStartMenuSectionDesc).sort(byPriority);
    return Promise.all(sectionEntries.map((section) => section.load()));
  }, []);
  const {status, value: sections} = useAsync(loadSections);

  return (
    <>
      <Row>
        <Col className="d-flex justify-content-end">
          <Button className="start-menu-close" variant="link" >
            <i className="fas fa-times" ></i>
          </Button>
        </Col>
      </Row>
      <Nav className="scrollspy-nav flex-column ml-4">
        {
          sections?.map((section) => <Link className="nav-link" key={section.desc.id} role="button" to={`${section.desc.id}-${suffix}`} spy={true} smooth={true} offset={-300} duration={500}>{section.desc.name}</Link>)
        }
      </Nav>
      <Container className="mb-4 analysis-tab">
        <Row>
          <Col>
            {status === 'success' ?
              sections?.map((section, i) => {
                return (<Element className={`${i === 0 || 'pt-6'}`} key={section.desc.id} name={`${section.desc.id}-${suffix}`}>
                  <section.factory {...section.desc} />
                </Element>);
              })
              : null}
          </Col>
        </Row>
      </Container >
    </>
  );
}
