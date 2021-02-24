import {GlobalEventHandler, I18nextManager, IProvenanceGraphDataDescription, UserSession} from 'phovea_core';
import React, {useRef} from 'react';
import {Card, Tab, Nav, Row, Col, Button, Dropdown} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ErrorAlertHandler, FormDialog, NotificationHandler, ProvenanceGraphMenuUtils} from 'tdp_core';
import {byDateDesc, ListItemDropdown, SessionListItem} from '..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';


export function SavedSessionCard() {
  const parent = useRef(null);

  const stopEvent = (event: React.MouseEvent<any>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const [savedSessions, setSavedSessions] = React.useState(null);
  const [otherSessions, setOtherSessions] = React.useState(null);
  const {graph, manager} = React.useContext(GraphContext);

  const listSessions = React.useMemo(() => async () => {
    const sessions = (await manager.list())?.filter((d) => ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
    const me = UserSession.getInstance().currentUserNameOrAnonymous();
    const mine = sessions?.filter((d) => d.creator === me);

    // TODO how to get the other saved sessions
    const other = sessions?.filter((d) => d.creator !== me);
    setSavedSessions(mine);
    setOtherSessions(other);
  }, []);

  const {status, error} = useAsync(listSessions);



  const deleteSession = async (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => {
    stopEvent(event);
    const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.deleteIt', {name: value.name}));
    if (deleteIt) {
      await manager.delete(value);
      NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.session'), value.name);
      setSavedSessions(savedSessions?.filter((t) => t.id !== value.id));
    }
    return false;
  };

  const editSession = (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => {
    stopEvent(event);
    // if (graph) {
    //   return false;
    // }
    ProvenanceGraphMenuUtils.editProvenanceGraphMetaData(value, {permission: ProvenanceGraphMenuUtils.isPersistent(value)}).then((extras) => {
      if (extras !== null) {
        Promise.resolve(manager.editGraphMetaData(value, extras))
          .then((desc) => {

            setSavedSessions((savedSessions) => {
              const copy = [...savedSessions];
              const i = copy.findIndex((s) => s.id === value.id);
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

  const cloneSession = (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => {
    stopEvent(event);
    manager.cloneLocal(value);
    return false;
  };


  // How to handle export of temorary and saved sessions
  const exportSession = (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => {
    stopEvent(event);
    if (!graph) {
      return false;
    }

    console.log(graph);
    const r = graph.persist();
    console.log(r);
    const str = JSON.stringify(r, null, '\t');
    //create blob and save it
    const blob = new Blob([str], {type: 'application/json;charset=utf-8'});
    const a = new FileReader();
    a.onload = (e) => {
      console.log('hello');
      const url = (e.target).result as string;
      const helper = parent.current.ownerDocument.createElement('a');
      helper.setAttribute('href', url);
      helper.setAttribute('target', '_blank');
      helper.setAttribute('download', `${graph.desc.name}.json`);
      parent.current.appendChild(helper);
      helper.click();
      helper.remove();
      NotificationHandler.pushNotification('success', I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.successMessage', {name: graph.desc.name}), NotificationHandler.DEFAULT_SUCCESS_AUTO_HIDE);
    };
    a.readAsDataURL(blob);
    return false;
  };




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
                    {savedSessions?.map((session) => {
                      return <SessionListItem key={session.id} status={status} value={session} error={error} exportSession={exportSession} editSession={editSession} cloneSession={cloneSession} deleteSession={deleteSession}>
                        <Button variant="outline-secondary" onClick={(event) => editSession(event, session)} className="mr-2 pt-1 pb-1">Edit</Button>
                        <ListItemDropdown>
                          <Dropdown.Item onClick={(event) => cloneSession(event, session)}>Clone</Dropdown.Item>
                          <Dropdown.Item onClick={(event) => exportSession(event, session)}>Export</Dropdown.Item>
                          <Dropdown.Item className="dropdown-delete" onClick={(event) => deleteSession(event, session)}>Delete</Dropdown.Item>
                        </ListItemDropdown>
                      </SessionListItem>;
                    })}
                  </Tab.Pane>
                  <Tab.Pane eventKey={`publicSessions}`}>
                    {otherSessions?.map((session) => {
                      return <SessionListItem key={session.id} status={status} value={session} error={error} exportSession={exportSession} editSession={editSession} cloneSession={cloneSession} deleteSession={deleteSession}>
                        <Button variant="outline-secondary" onClick={(event) => editSession(event, session)} className="mr-2 pt-1 pb-1">Edit</Button>
                        <ListItemDropdown>
                          <Dropdown.Item onClick={(event) => cloneSession(event, session)}>Clone</Dropdown.Item>
                          <Dropdown.Item onClick={(event) => exportSession(event, session)}>Export</Dropdown.Item>
                          <Dropdown.Item className="dropdown-delete" onClick={(event) => deleteSession(event, session)}>Delete</Dropdown.Item>
                        </ListItemDropdown>
                      </SessionListItem>;
                    })}
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
