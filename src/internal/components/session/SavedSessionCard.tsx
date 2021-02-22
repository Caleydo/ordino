import {UserSession} from 'phovea_core';
import React from 'react';
import {Card, Tab, Nav, Row, Col} from 'react-bootstrap';
import {ProvenanceGraphMenuUtils} from 'tdp_core';
import {byDateDesc, SavedSessionListItem} from '..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';


export function SavedSessionCard() {
  // Todo merge CurrentSessionCard with TemorarySessionCard
  const {manager} = React.useContext(GraphContext);
  const listSessions = React.useMemo(() => () => manager.list(), []);
  const {status, value: sessions, error} = useAsync(listSessions);
  const savedSessions = sessions?.filter((d) => ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
  const me = UserSession.getInstance().currentUserNameOrAnonymous();
  const myworkspaces = savedSessions?.filter((d) => d.creator === me);
  const otherworkspaces = savedSessions?.filter((d) => d.creator !== me);

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
                    {myworkspaces?.map((session) => <SavedSessionListItem key={session.id} status={status} value={session} error={error} />)}
                  </Tab.Pane>
                  <Tab.Pane eventKey={`publicSessions}`}>
                    {otherworkspaces?.map((session) => <SavedSessionListItem key={session.id} status={status} value={session} error={error} />)}
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
