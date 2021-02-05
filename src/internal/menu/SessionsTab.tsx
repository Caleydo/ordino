import React from "react"
import {Container, Button, ButtonGroup, Card, Col, Dropdown, Nav, Row, Tab} from 'react-bootstrap'
import {ImportSession} from './ImportSession'
import {TempSessions} from './TempSession'
import {Link, Element} from 'react-scroll'

export const SessionsTab = () => {
    return (
        <Container fluid className="my-4 analysis-tab">
            <Row>
                <Col md={3}>
                    <Nav style={{position: 'fixed'}} className="scrollspy-nav flex-column">

                        <Link className="nav-link pl-5" role="button" activeClass="nav-active" to={`element-${1}`} spy={true} smooth={true} offset={-180} duration={500}>
                            Current Session
                        </Link>
                        <Link className="nav-link pl-5" role="button" activeClass="nav-active" to={`element-${2}`} spy={true} smooth={true} offset={-180} duration={500}>
                            Saved Session
                        </Link>
                        <Link className="nav-link pl-5" role="button" activeClass="nav-active" to={`element-${3}`} spy={true} smooth={true} offset={-180} duration={500}>
                            Temporary Session
                        </Link>
                        <Link className="nav-link pl-5" role="button" activeClass="nav-active" to={`element-${4}`} spy={true} smooth={true} offset={-200} duration={500}>
                            Import Session
                        </Link>
                    </Nav>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col >
                            <h4 className="text-left d-flex align-items-center mt-4 mb-3"><i className="mr-2 ordino-icon-2 fas fa-history" ></i> Current Session</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col >
                            <Card style={{}} className="shadow-sm">
                                <Card.Body className="p-3">
                                    <Card.Text>
                                        Save the current session to open it later again or share it with other users.
                         </Card.Text>
                                    <Row className="align-items-center">
                                        <Col md={10}>
                                            <Button variant="link" >
                                                <i className="mr-2 fas fa-history" ></i>Temporary Session 159
                                        </Button>
                                        </Col>
                                        <Col md={2} className="d-flex justify-content-end">
                                            <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Save</Button>
                                            <Dropdown className="session-dropdown" as={ButtonGroup}>
                                                <Dropdown.Toggle style={{color: "#6c757d", }} variant="link"><i className="fas fa-ellipsis-v " ></i></Dropdown.Toggle>
                                                <Dropdown.Menu className="super-colors">
                                                    <Dropdown.Item eventKey="1">Clone</Dropdown.Item>
                                                    <Dropdown.Item eventKey="2">Export</Dropdown.Item>
                                                    <Dropdown.Item style={{color: "red"}} eventKey="3" >Delete</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>{' '}
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col >
                                            <Card.Text className="ml-5 text-muted">
                                                an hour ago
                         </Card.Text>
                                        </Col >
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col >
                    </Row>
                    <Row className="mt-4">
                        <p className="mt-4 " style={{color: "#72818d", fontSize: "1.2em"}}> Load a previous analysis session</p>
                    </Row>
                    <Row>
                        <h4 className="text-left mt-2 mb-3"><i className="mr-2 fas fa-cloud" ></i> Saved Session</h4>
                    </Row>
                    <Row md={1}>
                        <Card style={{}} className="shadow-sm">
                            <Card.Body className="p-3">
                                <Card.Text>
                                    The saved session will be stored on the server. By default, sessions are private, meaning that only the creator has access to it. If the status is set to public, others can also see the session and access certain states by opening a shared link.
                         </Card.Text>
                                {/* ----------------------------------------- */}
                                <Row>
                                    <Col >
                                        <Tab.Container defaultActiveKey="first">
                                            <Row>
                                                <Col >
                                                    <Nav className="session-tab" variant="pills" style={{borderBottom: "2px solid #D4D7DD"}}>
                                                        <Nav.Item >
                                                            <Nav.Link eventKey="first"><i className="mr-2 fas fa-user"></i>My sessions</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="second"> <i className="mr-2 fas fa-users"></i>Public sessions</Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                </Col>
                                            </Row>
                                            <Row className="pt-4">
                                                <Col >
                                                    <Tab.Content>
                                                        <Tab.Pane eventKey="first">
                                                            <Row className="align-items-center">
                                                                <Col md={10}>
                                                                    <Button variant="link" >
                                                                        <i className="mr-2 fas fa-cloud" ></i>Ordino NMC Case Study 1
                                                                     </Button>
                                                                </Col>
                                                                <Col md={2} className="d-flex justify-content-end">
                                                                    <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Edit</Button>
                                                                    <Dropdown className="session-dropdown" as={ButtonGroup}>
                                                                        <Dropdown.Toggle style={{color: "#6c757d", }} variant="link"><i className="fas fa-ellipsis-v " ></i></Dropdown.Toggle>
                                                                        <Dropdown.Menu className="super-colors">
                                                                            <Dropdown.Item eventKey="1">Clone</Dropdown.Item>
                                                                            <Dropdown.Item eventKey="2">Export</Dropdown.Item>
                                                                            <Dropdown.Item style={{color: "red"}} eventKey="3" >Delete</Dropdown.Item>
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>{' '}
                                                                </Col>
                                                            </Row>
                                                            <Row className="ml-4">
                                                                <Col md={12}>
                                                                    <p>
                                                                        This is an optional description for a saved session
                                                            </p>
                                                                </Col >
                                                                <Col md={3}>
                                                                    <p className="text-muted">
                                                                        1 hour ago
                                                            </p>
                                                                </Col >
                                                                <Col md={3}>
                                                                    <p className="text-muted">
                                                                        <i className="mr-2 fas fa-users"></i>Public access
                                                            </p>
                                                                </Col >
                                                            </Row>
                                                            <hr />
                                                            <Row className="align-items-center">
                                                                <Col md={10}>
                                                                    <Button variant="link" >
                                                                        <i className="mr-2 fas fa-cloud" ></i>Saved session 8
                                                                     </Button>
                                                                </Col>
                                                                <Col md={2} className="d-flex justify-content-end">
                                                                    <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Edit</Button>
                                                                    <Dropdown className="session-dropdown" as={ButtonGroup}>
                                                                        <Dropdown.Toggle style={{color: "#6c757d", }} variant="link"><i className="fas fa-ellipsis-v " ></i></Dropdown.Toggle>
                                                                        <Dropdown.Menu className="super-colors">
                                                                            <Dropdown.Item eventKey="1">Clone</Dropdown.Item>
                                                                            <Dropdown.Item eventKey="2">Export</Dropdown.Item>
                                                                            <Dropdown.Item style={{color: "red"}} eventKey="3" >Delete</Dropdown.Item>
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>{' '}
                                                                </Col>
                                                            </Row>
                                                            <Row className="ml-4">
                                                                <Col md={3}>
                                                                    <p className="text-muted">
                                                                        1 hour ago
                                                            </p>
                                                                </Col >
                                                                <Col md={3}>
                                                                    <p className="text-muted">
                                                                        <i className="mr-2 fas fa-users"></i>Public access
                                                            </p>
                                                                </Col >
                                                            </Row>
                                                            <hr />
                                                            <Row className="align-items-center">
                                                                <Col md={10}>
                                                                    <Button variant="link" >
                                                                        <i className="mr-2 fas fa-cloud" ></i>Saved session 7
                                                                     </Button>
                                                                </Col>
                                                                <Col md={2} className="d-flex justify-content-end">
                                                                    <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Edit</Button>
                                                                    <Dropdown className="session-dropdown" as={ButtonGroup}>
                                                                        <Dropdown.Toggle style={{color: "#6c757d", }} variant="link"><i className="fas fa-ellipsis-v " ></i></Dropdown.Toggle>
                                                                        <Dropdown.Menu className="super-colors">
                                                                            <Dropdown.Item eventKey="1">Clone</Dropdown.Item>
                                                                            <Dropdown.Item eventKey="2">Export</Dropdown.Item>
                                                                            <Dropdown.Item style={{color: "red"}} eventKey="3" >Delete</Dropdown.Item>
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>{' '}
                                                                </Col>
                                                            </Row>
                                                            <Row className="ml-4">
                                                                <Col md={12}>
                                                                    <p>
                                                                        This is an optional description for a saved session
                                                            </p>
                                                                </Col >
                                                                <Col md={3}>
                                                                    <p className="text-muted">
                                                                        20 minutes ago
                                                            </p>
                                                                </Col >
                                                                <Col md={3}>
                                                                    <p className="text-muted">
                                                                        <i className="mr-2 fas fa-user"></i>Private access
                                                            </p>
                                                                </Col >
                                                            </Row>
                                                        </Tab.Pane>
                                                        <Tab.Pane eventKey="second">
                                                            Public sessions
                                                </Tab.Pane>
                                                    </Tab.Content>

                                                </Col>
                                            </Row>
                                        </Tab.Container>
                                    </Col >
                                </Row>
                            </Card.Body>
                        </Card>
                    </Row>
                    <Row>
                        <h4 className="text-left mt-4 mb-3"><i className="mr-2 fas fa-history" ></i>Temporary Sessions</h4>
                    </Row>
                    <Row md={1}>
                        <TempSessions />
                    </Row>
                    <Row>
                        <h4 className="text-left mt-4 mb-3"><i className="mr-2 fas fa-file-upload" ></i> Import Session</h4>
                    </Row>
                    <Row md={1}>
                        <ImportSession />
                    </Row>

                </Col>
            </Row>

        </Container >
    )
}