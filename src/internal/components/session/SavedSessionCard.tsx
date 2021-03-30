import {I18nextManager, IProvenanceGraphDataDescription, UserSession} from 'phovea_core';
import React from 'react';
import {Tab, Nav, Row, Col, Button, Dropdown} from 'react-bootstrap';
import {ProvenanceGraphMenuUtils} from 'tdp_core';
import {IStartMenuSessionSectionDesc} from '../../..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../OrdinoApp';
import {ListItemDropdown} from '../common';
import {EAction, CommonSessionCard} from './CommonSessionCard';
import {SessionListItem} from './SessionListItem';
import {byDateDesc} from './utils';


export default function SavedSessionCard({name, faIcon}: IStartMenuSessionSectionDesc) {
  const {manager} = React.useContext(GraphContext);
  const [sessions, setSessions] = React.useState<IProvenanceGraphDataDescription[]>(null);

  const listSessions = React.useMemo(() => async () => {
    const all = (await manager.list())?.filter((d) => ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
    setSessions(all);
  }, []);

  const me = UserSession.getInstance().currentUserNameOrAnonymous();
  const savedSessions = sessions?.filter((d) => d.creator === me);
  const otherSessions = sessions?.filter((d) => d.creator !== me);

  const {status} = useAsync(listSessions);

  return (
    <>
      <p className="lead text-ordino-gray-4 mt-4">Load a previous analysis session</p>
      <CommonSessionCard cardName={name} faIcon={faIcon} cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.savedCardInfo')}>
        {(sessionAction) => {
          return <Tab.Container defaultActiveKey="mySessions">
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
                    {status === 'pending' &&
                      <p><i className="fas fa-circle-notch fa-spin"></i> Loading sets...</p>
                    }
                    {status === 'success' &&
                      savedSessions.length === 0 &&
                      <p>No sets available</p>
                    }
                    {
                      status === 'success' && savedSessions.length > 0 &&
                      savedSessions?.map((session) => {
                        return <SessionListItem key={session.id} desc={session} selectSession={(event) => sessionAction(EAction.SELECT, event, session)}>
                          <Button variant="outline-secondary" onClick={(event) => sessionAction(EAction.EDIT, event, session, setSessions)} className="mr-2 pt-1 pb-1">Edit</Button>
                          <ListItemDropdown >
                            <Dropdown.Item className="dropdown-delete" onClick={(event) => sessionAction(EAction.DELETE, event, session, setSessions)}>Delete</Dropdown.Item>
                          </ListItemDropdown>
                        </SessionListItem>;
                      })}
                    {status === 'error' && <p>Error when loading sets</p>}
                  </Tab.Pane>
                  <Tab.Pane eventKey={`publicSessions}`}>
                    {status === 'pending' &&
                      <p><i className="fas fa-circle-notch fa-spin"></i> Loading sets...</p>
                    }
                    {status === 'success' &&
                      otherSessions.length === 0 &&
                      <p>No sets available</p>
                    }
                    {
                      status === 'success' && otherSessions.length > 0 &&
                      otherSessions?.map((session) => {
                        return <SessionListItem key={session.id} desc={session}>
                          <Button variant="outline-secondary" title="Clone to Temporary Session" onClick={(event) => sessionAction(EAction.CLONE, event, session)} className="mr-2 pt-1 pb-1">Clone</Button>
                        </SessionListItem>;
                      })}
                    {status === 'error' && <p>Error when loading sets</p>}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>;
        }}
      </CommonSessionCard>
    </>
  );
}
