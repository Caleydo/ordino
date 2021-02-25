import {GlobalEventHandler, I18nextManager, IProvenanceGraphDataDescription, UserSession} from 'phovea_core';
import React, {useRef} from 'react';
import {Card, Tab, Nav, Row, Col, Button, Dropdown} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ErrorAlertHandler, FormDialog, NotificationHandler, ProvenanceGraphMenuUtils} from 'tdp_core';
import {byDateDesc, ListItemDropdown, SessionListItem} from '..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';
import {stopEvent} from '../../menu/utils';
import {CommonSessionCard} from './CommonSessionCard';


export function SavedSessionCard() {
  const parent = useRef(null);
  const [savedSessions, setSavedSessions] = React.useState<IProvenanceGraphDataDescription[]>(null);
  const [otherSessions, setOtherSessions] = React.useState<IProvenanceGraphDataDescription[]>(null);
  const {graph, manager} = React.useContext(GraphContext);

  const listSessions = React.useMemo(() => async () => {
    const sessions = (await manager.list());
    const me = UserSession.getInstance().currentUserNameOrAnonymous();
    const mine = sessions?.filter((d) => d.creator === me);
    const other = sessions?.filter((d) => d.creator !== me);
    setSavedSessions(mine);
    setOtherSessions(other);
  }, []);

  const {status, error} = useAsync(listSessions);

  const editSession = (event: React.MouseEvent<DropdownItemProps>, desc: IProvenanceGraphDataDescription) => {
    stopEvent(event);
    // if (graph) {
    //   return false;
    // }
    ProvenanceGraphMenuUtils.editProvenanceGraphMetaData(desc, {permission: ProvenanceGraphMenuUtils.isPersistent(desc)}).then((extras) => {
      if (extras !== null) {
        Promise.resolve(manager.editGraphMetaData(desc, extras))
          .then((desc) => {

            setSavedSessions((savedSessions) => {
              const copy = [...savedSessions];
              const i = copy.findIndex((s) => s.id === desc.id);
              copy[i] = desc;
              return copy;
            });
            GlobalEventHandler.getInstance().fire(ProvenanceGraphMenuUtils.GLOBAL_EVENT_MANIPULATED);
          })
          .catch(ErrorAlertHandler.getInstance().errorAlert);
      }
    });
    return false;
  };


  return (
    <>
      <p className="ordino-info-text mt-4 "> Load a previous analysis session</p>
      <CommonSessionCard cardName="Saved Session" faIcon="fa-cloud" cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.savedCardInfo')}>
        {(exportSession, cloneSession, _, deleteSession) => {
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
                    {savedSessions?.map((session) => {
                      return <SessionListItem key={session.id} status={status} desc={session} error={error}>
                        <Button variant="outline-secondary" onClick={(event) => editSession(event, session)} className="mr-2 pt-1 pb-1">Edit</Button>
                        <ListItemDropdown ref={parent}>
                          <Dropdown.Item onClick={(event) => cloneSession(event, session)}>Clone</Dropdown.Item>
                          <Dropdown.Item onClick={(event) => exportSession(event, session)}>Export</Dropdown.Item>
                          <Dropdown.Item className="dropdown-delete" onClick={(event) => deleteSession(event, session, setSavedSessions)}>Delete</Dropdown.Item>
                        </ListItemDropdown>
                      </SessionListItem>;
                    })}
                  </Tab.Pane>
                  <Tab.Pane eventKey={`publicSessions}`}>
                    {otherSessions?.map((session) => {
                      return <SessionListItem key={session.id} status={status} desc={session} error={error}>
                        <Button variant="outline-secondary" onClick={(event) => cloneSession(event, session)} className="mr-2 pt-1 pb-1">Clone</Button>
                      </SessionListItem>;
                    })}
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
