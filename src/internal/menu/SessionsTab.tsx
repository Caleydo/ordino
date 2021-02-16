import React from 'react';
import {Container, Card, Col, Nav, Row, Tab, Button} from 'react-bootstrap';
import {Link, Element} from 'react-scroll';
import {UniqueIdManager} from 'phovea_core';
import {CurrentItem, SavedItem} from '../components/UploadedItem';
import {SessionDropzone} from '../components/SessionDropzone';

export function SessionsTab() {
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
                    <Link className="nav-link" role="button" to={`current-${suffix}`} spy={true} smooth={true} offset={-300} duration={500}>Current Session</Link>
                    <Link className="nav-link" role="button" to={`saved-${suffix}`} spy={true} smooth={true} offset={-300} duration={500}>Saved Session</Link>
                    <Link className="nav-link" role="button" to={`temporary-${suffix}`} spy={true} smooth={true} offset={-300} duration={500}>Temporary Session</Link>
                    <Link className="nav-link" role="button" to={`import-${suffix}`} spy={true} smooth={true} offset={-300} duration={500}>Import Session</Link>
                </Nav>
            <Container className="mb-4 analysis-tab">
                <Row>
                    <Col>
                        <Element name={`current-${suffix}`}>
                            <h4 className="text-left d-flex align-items-center mb-3"><i className="mr-2 ordino-icon-2 fas fa-history" ></i> Current Session</h4>
                            <Card className="shadow-sm">
                                <Card.Body className="p-3">
                                    <Card.Text>
                                        Save the current session to open it later again or share it with other users.
                                </Card.Text>
                                    <CurrentItem name="Temporary Session 159" uploadedDate="a minute ago" />
                                </Card.Body>
                            </Card>
                        </Element>

                        <Element className="pt-6" name={`saved-${suffix}`}>
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
                                                        <SavedItem name="Ordino NMC Case Study 1" uploadedDate="20 minutes ago" accessType="private" />
                                                        <SavedItem name="Saved Session 1" uploadedDate="20 minutes ago" accessType="private" />
                                                        <SavedItem name="Saved Session 5" description="This is an optional description for the saved session" uploadedDate="1 hour ago" accessType="public" />
                                                        <SavedItem name="Saved Session 22" uploadedDate="2 days ago" accessType="public" />
                                                    </Tab.Pane>
                                                    <Tab.Pane eventKey={`publicSessions}`}>
                                                        <SavedItem name="Saved Session 1" uploadedDate="20 minutes ago" accessType="public" />
                                                        <SavedItem name="Saved Session 33" uploadedDate="20 minutes ago" accessType="public" />
                                                        <SavedItem name="Saved Session 50" uploadedDate="1 hour ago" accessType="public" />
                                                        <SavedItem name="Saved Session 90" uploadedDate="2 days ago" accessType="public" />
                                                    </Tab.Pane>
                                                </Tab.Content>

                                            </Col>
                                        </Row>
                                    </Tab.Container>
                                </Card.Body>
                            </Card>
                        </Element>
                        <Element className="pt-6" name={`temporary-${suffix}`}>
                            <h4 className="text-left mt-4 mb-3"><i className="mr-2 ordino-icon-2 fas fa-history" ></i>Temporary Sessions</h4>
                            <Card className="shadow-sm">
                                <Card.Body className="p-3">
                                    <Card.Text>
                                        A temporary session will only be stored in your local browser cache.It is not possible to share a link to states
                                        of this session with others. Only the 10 most recent sessions will be stored.
                                </Card.Text>
                                    <CurrentItem name="Temporary session 20" uploadedDate="a minute ago" />
                                    <CurrentItem name="Temporary session 19" uploadedDate="5 minutes ago" />
                                    <CurrentItem name="Temporary session 18" uploadedDate="10 minutes ago" />
                                    <CurrentItem name="Temporary session 17" uploadedDate="15 minutes ago" />
                                </Card.Body>
                            </Card>
                        </Element>

                        <Element className="py-6" name={`import-${suffix}`}>
                            <h4 className="text-left mt-4 mb-3"><i className="mr-2 fas ordino-icon-2 fa-file-upload" ></i> Import Session</h4>
                            <Card className="shadow-sm">
                                <Card.Body className="p-3">
                                    <Card.Text>
                                        You can import sessions as temporary sessions and continue the analysis afterwards.
                                </Card.Text>
                                    <SessionDropzone />
                                </Card.Body>
                            </Card>


                        </Element>
                    </Col>
                </Row>
            </Container >
        </>
    );
}
