import React from 'react';
import {Container, Card, Col, Nav, Row, Tab, Button} from 'react-bootstrap';
import {Link, Element} from 'react-scroll';
import {UniqueIdManager} from 'phovea_core';
import {UploadSessionCard} from '../../components';
import {CurrentSessionCard} from '../../components/session/CurrentSessionCard';
import {SavedSessionCard} from '../../components/session/SavedSessionCard';
import {TemporarySessionCard} from '../../components/session/TemporarySessionCard';






export function SessionsTab() {

  const cards = [
    {
      id: 'current',
      headerText: 'Current Session',
      getElement: () => <CurrentSessionCard />
    },
    {
      id: 'saved',
      headerText: 'Saved Session',
      getElement: () => <SavedSessionCard />
    },
    {
      id: 'temporary',
      headerText: 'Temporary Session',
      getElement: () => <TemporarySessionCard />
    },
    {
      id: 'import',
      headerText: 'Import Session',
      getElement: () => <UploadSessionCard />
    }
  ];


  const suffix = UniqueIdManager.getInstance().uniqueId();
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
          cards.map((card) => <Link className="nav-link" key={card.id} role="button" to={`${card.id}-${suffix}`} spy={true} smooth={true} offset={-300} duration={500}>{card.headerText}</Link>)
        }
      </Nav>
      <Container className="mb-4 analysis-tab">
        <Row>
          <Col>
            {
              cards.map((card, i) => {
                return <Element className={`${i === 0 || 'pt-6'}`} key={card.id} name={`${card.id}-${suffix}`}>
                  {card.getElement()}
                </Element>;
              })
            }
          </Col>
        </Row>
      </Container >
    </>
  );
}
