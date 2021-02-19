import React from 'react';
import {Card, Tab, Nav, Row, Col} from 'react-bootstrap';
import {SavedSessionListItem} from '..';


export function SavedSessionCard() {
  return (
    <>
      <p className="ordino-info-text mt-4 "> Load a previous analysis session</p>
      <h4 className="text-left mt-2 mb-3"><i className="mr-2 ordino-icon-2 fas fa-cloud" ></i> Saved Session</h4>
      <Card className="shadow-sm">
        <Card.Body className="p-3">
          <Card.Text>
            The saved session will be stored on the server. By default, sessions are private, meaning that only the creator has access to it. If the status is set to public, others can also see the session and access certain states by opening a shared link.
        </Card.Text>
          <Tab.Container defaultActiveKey="mySessions">
            <Nav className="session-tab" variant="pills">
              <Nav.Item >
                <Nav.Link eventKey="mySessions"><i className="mr-2 fas fa-user"></i>My sessions</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey={`publicSessions}`}> <i className="mr-2 fas fa-users"></i>Public sessions</Nav.Link>
              </Nav.Item>
            </Nav>
            <Row className="pt-4">
              <Col >
                <Tab.Content>
                  <Tab.Pane eventKey="mySessions">
                    <SavedSessionListItem name="Ordino NMC Case Study 1" uploadedDate="20 minutes ago" accessType="private" />
                    <SavedSessionListItem name="Saved Session 1" uploadedDate="20 minutes ago" accessType="private" />
                    <SavedSessionListItem name="Saved Session 5" description="This is an optional description for the saved session" uploadedDate="1 hour ago" accessType="public" />
                    <SavedSessionListItem name="Saved Session 22" uploadedDate="2 days ago" accessType="public" />
                  </Tab.Pane>
                  <Tab.Pane eventKey={`publicSessions}`}>
                    <SavedSessionListItem name="Saved Session 1" uploadedDate="20 minutes ago" accessType="public" />
                    <SavedSessionListItem name="Saved Session 33" uploadedDate="20 minutes ago" accessType="public" />
                    <SavedSessionListItem name="Saved Session 50" uploadedDate="1 hour ago" accessType="public" />
                    <SavedSessionListItem name="Saved Session 90" uploadedDate="2 days ago" accessType="public" />
                  </Tab.Pane>
                </Tab.Content>

              </Col>
            </Row>
          </Tab.Container>
        </Card.Body>
      </Card>
    </>
  );

}
