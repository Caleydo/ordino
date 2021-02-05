import React, {useEffect} from "react";
import {Container, Button, ButtonGroup, Card, Col, Dropdown, Nav, Row, Tab} from 'react-bootstrap';
import {ImportSession} from './ImportSession';
import {TempSessions} from './TempSession';
import Select from 'react-select';
import Dropzone from 'react-dropzone'
import {Link, Element, Events, scrollSpy} from 'react-scroll'


const genSets = [
    "All",
    "Cancer Gene Census",
    "Essential Genes",
];

const publicSets = [
    "Dd",
    "TP53 Predictor Score",
    "List"
];

const mySets = [
    "My Collection",
    "Research Focus 1",
    "Research Focus 2"
];

export const DatasetsTab = () => {
    useEffect(() => {
        console.log("rendering")
        Events.scrollEvent.register('begin', function (to, element) {
            console.log('begin', arguments);
        });

        Events.scrollEvent.register('end', function (to, element) {
            console.log('end', arguments);
        });

        scrollSpy.update();
        return () => {
            Events.scrollEvent.remove('begin');
            Events.scrollEvent.remove('end');
        }
    }, [])

    return (

        <Container fluid className="mb-4 mt-4 datasets-tab">
            <Row>
                <Col md={3}>
                    <Nav style={{position: 'fixed'}} className="scrollspy-nav flex-column">
                        <Link className="nav-link pl-5" role="button" activeClass="nav-active" to={`element-${20}`} spy={true} smooth={true} offset={-380} duration={500}>Genes</Link>
                        <Link className="nav-link pl-5" role="button" activeClass="nav-active" to={`element-${2}`} spy={true} smooth={true} offset={-180} duration={500}>Cell Lines</Link>
                        <Link className="nav-link pl-5" role="button" activeClass="nav-active" to={`element-${3}`} spy={true} smooth={true} offset={-180} duration={500}>Tissues</Link>
                        <Link className="nav-link pl-5" role="button" activeClass="nav-active" to={`element-${4}`} spy={true} smooth={true} offset={-200} duration={500}>Upload</Link>
                    </Nav>
                </Col>
                <Col md={6}>
                    <Element name={`element-${20}`}>
                        <Row>
                            <p className="ordino-info-text">Start a new analysis session by loading a dataset</p>
                        </Row>
                        <Row>
                            <h4 className="text-left mt-4 mb-3"><i className="mr-2 ordino-icon-2 fas fa-database" ></i> Genes</h4>
                        </Row>

                        <Row>

                            <Card style={{}} className="shadow-sm">
                                <Card.Body className="p-3">
                                    <Row>
                                        <Col >
                                            <Tab.Container defaultActiveKey="first">
                                                <Row>
                                                    <Col >
                                                        <Nav className="session-tab" variant="pills" style={{borderBottom: "2px solid #D4D7DD"}}>
                                                            <Nav.Item >
                                                                <Nav.Link eventKey="first"><i className="mr-2 fas fa-male"></i>Human</Nav.Link>
                                                            </Nav.Item>
                                                            <Nav.Item>
                                                                <Nav.Link disabled eventKey="second"> <i className="mr-2 fa fa-fw mouse-icon"></i>Mouse</Nav.Link>
                                                            </Nav.Item>
                                                        </Nav>
                                                    </Col>
                                                </Row>
                                                <Row className="pt-4">
                                                    <Col >
                                                        <Tab.Content>
                                                            <Tab.Pane eventKey="first">
                                                                <DatasetSection />
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey="second">
                                                                Mouse
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
                    </Element>

                    <Row>
                        <h4 className="text-left mt-4 mb-3"><i className="mr-2 fas fa-database" ></i> Cell Lines</h4>
                    </Row>
                    <Row md={1}>
                        <Element name={`element-${2}`}>
                            <Card style={{}} className="shadow-sm">
                                <Card.Body className="p-3">
                                    <Row>
                                        <Col >
                                            <Tab.Container defaultActiveKey="first">
                                                <Row>
                                                    <Col >
                                                        <Nav className="session-tab" variant="pills" style={{borderBottom: "2px solid #D4D7DD"}}>
                                                            <Nav.Item >
                                                                <Nav.Link eventKey="first"><i className="mr-2 fas fa-male"></i>Human</Nav.Link>
                                                            </Nav.Item>
                                                            <Nav.Item>
                                                                <Nav.Link disabled eventKey="second"> <i className="mr-2 fa fa-fw mouse-icon"></i>Mouse</Nav.Link>
                                                            </Nav.Item>
                                                        </Nav>
                                                    </Col>
                                                </Row>
                                                <Row className="pt-4">
                                                    <Col >
                                                        <Tab.Content>
                                                            <Tab.Pane eventKey="first">
                                                                <DatasetSection />
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey="second">
                                                                Mouse
                                                </Tab.Pane>
                                                        </Tab.Content>

                                                    </Col>
                                                </Row>
                                            </Tab.Container>
                                        </Col >
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Element>
                    </Row>
                    <Row>
                        <h4 className="text-left mt-4 mb-3"><i className="mr-2 fas fa-database" ></i> Tissues</h4>
                    </Row>
                    <Row md={1}>
                        <Element name={`element-${3}`}>
                            <Card style={{}} className="shadow-sm">
                                <Card.Body className="p-3">
                                    <Row>
                                        <Col >
                                            <Tab.Container defaultActiveKey="first">
                                                <Row>
                                                    <Col >
                                                        <Nav className="session-tab" variant="pills" style={{borderBottom: "2px solid #D4D7DD"}}>
                                                            <Nav.Item >
                                                                <Nav.Link eventKey="first"><i className="mr-2 fas fa-male"></i>Human</Nav.Link>
                                                            </Nav.Item>
                                                            <Nav.Item>
                                                                <Nav.Link disabled eventKey="second"> <i className="mr-2 fa fa-fw mouse-icon"></i>Mouse</Nav.Link>
                                                            </Nav.Item>
                                                        </Nav>
                                                    </Col>
                                                </Row>
                                                <Row className="pt-4">
                                                    <Col >
                                                        <Tab.Content>
                                                            <Tab.Pane eventKey="first">
                                                                <DatasetSection />
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey="second">
                                                                Mouse
                                                </Tab.Pane>
                                                        </Tab.Content>

                                                    </Col>
                                                </Row>
                                            </Tab.Container>
                                        </Col >
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Element>
                    </Row>
                    <Row>
                        <h4 className="text-left mt-4 mb-3"><i className="mr-2 fas fa-file-upload" ></i> Upload</h4>
                    </Row>

                    <Row>
                        <Element name={`element-${4}`}>
                            <Col >
                                <Card style={{}} className="shadow-sm">
                                    <Card.Body className="p-3">
                                        <Row>
                                            <Col>
                                                <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                                                    {({getRootProps, getInputProps}) => (
                                                        <section>
                                                            <div {...getRootProps()}>
                                                                <input {...getInputProps()} />
                                                                <div className="session-dropzone">
                                                                    <p className="text-center">Drop session file here or click to upload</p>
                                                                    <p className="text-center" >Accepted file formats: JSON file</p>
                                                                </div>
                                                            </div>
                                                        </section>
                                                    )}
                                                </Dropzone>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col >
                                                <Tab.Container defaultActiveKey="first">
                                                    <Row>
                                                        <Col >
                                                            <Nav className="session-tab" variant="pills" style={{borderBottom: "2px solid #D4D7DD"}}>
                                                                <Nav.Item >
                                                                    <Nav.Link eventKey="first"><i className="mr-2 fas fa-user"></i>My Datasets</Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item>
                                                                    <Nav.Link eventKey="second"> <i className="mr-2 fas fa-users"></i>Public Datasets</Nav.Link>
                                                                </Nav.Item>
                                                            </Nav>
                                                        </Col>
                                                    </Row>
                                                    <Row className="pt-4">
                                                        <Col >
                                                            <Tab.Content>
                                                                <Tab.Pane eventKey="first">
                                                                    <DatasetFile />
                                                                    <DatasetFile />
                                                                    <DatasetFile />
                                                                </Tab.Pane>
                                                                <Tab.Pane eventKey="second">
                                                                    Mouse
                                                </Tab.Pane>
                                                            </Tab.Content>

                                                        </Col>
                                                    </Row>
                                                </Tab.Container>
                                            </Col >
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Element>

                    </Row>

                </Col>
            </Row>
        </Container >
    )
}

const DatasetFile = () => {
    return (
        <>
            <Row className="align-items-center">
                <Col md={10}>
                    <Button variant="link" >
                        <i className="mr-2 fas fa-file-csv" ></i>crispr_dataset
             </Button>
                </Col>
                <Col md={2} className="d-flex justify-content-end">
                    <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Edit</Button>
                    <Dropdown className="session-dropdown" as={ButtonGroup}>
                        <Dropdown.Toggle style={{color: "#6c757d", }} variant="link"><i className="fas fa-ellipsis-v " ></i></Dropdown.Toggle>
                        <Dropdown.Menu className="super-colors">
                            <Dropdown.Item eventKey="1">Edit</Dropdown.Item>
                            <Dropdown.Item style={{color: "red"}} eventKey="2" >Delete</Dropdown.Item>
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
                        Tue, 09 Sep 2020
                    </p>
                </Col >
                <Col md={3}>
                    <p className="text-muted">
                        <i className="mr-2 fas fa-users"></i>Public access
                    </p>
                </Col >
            </Row>
            <hr />
        </>
    )
}


const SearchBox = () => {
    const options = [
        {value: 'chocolate', label: 'Chocolate'},
        {value: 'strawberry', label: 'Strawberry'},
        {value: 'vanilla', label: 'Vanilla'}
    ]
    return (
        <Select isMulti={true} options={options} />
    )
}

const DatasetSection = () => {
    return (
        <>
            <Row>
                <Col >
                    <SearchBox></SearchBox>
                </Col>
                <Button variant="secondary" className="mr-2 pt-1 pb-1">Open</Button>
                <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Save as set</Button>

            </Row>
            <Row className="mt-4">
                <Col md={4}>
                    <header ><i className="mr-2 fas fa-database"></i>Predifined Sets</header>

                    <ButtonGroup vertical>
                        {genSets.map((s, i) => <Button key={i} className="text-left" variant="link" >{s}</Button>)}
                    </ButtonGroup>

                </Col>
                <Col md={4} style={{borderLeft: "1px solid #D4D7DD"}}>
                    <header  ><i className="mr-2 fas fa-user"></i>My Sets</header>

                    {mySets.map((s, i) => {
                        return (
                            <ButtonGroup style={{width: "100%"}} className="justify-content-between" key={i}>
                                <Button className="text-left" variant="link" >{s}</Button>
                                <Dropdown className="session-dropdown" as={ButtonGroup}>
                                    <Dropdown.Toggle style={{color: "#6c757d", }} variant="link"><i className="fas fa-ellipsis-v " ></i></Dropdown.Toggle>
                                    <Dropdown.Menu className="super-colors">
                                        <Dropdown.Item eventKey="1">Edit</Dropdown.Item>
                                        <Dropdown.Item style={{color: "red"}} eventKey="2" >Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>{' '}
                            </ButtonGroup>
                        )
                    })}
                </Col>
                <Col md={4} style={{borderLeft: "1px solid #D4D7DD"}}>
                    <header ><i className="mr-2 fas fa-users"></i>Public Sets</header>
                    <ButtonGroup vertical>
                        {publicSets.map((s, i) => <Button key={i} className="text-left" variant="link" >{s}</Button>)}
                    </ButtonGroup>
                </Col>
            </Row>
        </>
    )
}