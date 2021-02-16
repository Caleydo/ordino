import React from 'react';
import {Container, Card, Col, Nav, Row, Tab, Button} from 'react-bootstrap';
import {Link, Element} from 'react-scroll';
import {UniqueIdManager} from 'phovea_core';
import {DatasetDropzone, DatasetSection, UploadedItem} from '../components';


const genSets = [
    'All',
    'Cancer Gene Census',
    'Essential Genes',
];

const publicSets = [
    'Dd',
    'TP53 Predictor Score',
    'List'
];

const mySets = [
    'My Collection',
    'Research Focus 1',
    'Research Focus 2'
];

export function DatasetsTab() {
    const suffix = UniqueIdManager.getInstance().uniqueId();

    return (

        <Container fluid className="mb-4 datasets-tab">
            <Row>
                <Col className="d-flex justify-content-end">
                    <Button className="start-menu-close" variant="link" >
                        <i className="fas fa-times" ></i>
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <Nav className="scrollspy-nav flex-column">
                        <Link className="nav-link" role="button" to={`genes_${suffix}`} spy={true} smooth={true} offset={-250} duration={500}>Genes</Link>
                        <Link className="nav-link" role="button" to={`cellline_${suffix}`} spy={true} smooth={true} offset={-250} duration={500}>Cell Lines</Link>
                        <Link className="nav-link" role="button" to={`tissue_${suffix}`} spy={true} smooth={true} offset={-250} duration={500}>Tissues</Link>
                        <Link className="nav-link" role="button" to={`upload_${suffix}`} spy={true} smooth={true} offset={-250} duration={500}>Upload</Link>
                    </Nav>
                </Col>
                <Col md={6}>
                    <Element name={`genes_${suffix}`}>
                        <p className="ordino-info-text">Start a new analysis session by loading a dataset</p>
                        <h4 className="text-left mt-4 mb-3"><i className="mr-2 ordino-icon-2 fas fa-database" ></i> Genes</h4>
                        <Card className="shadow-sm">
                            <Card.Body className="p-3">
                                <Tab.Container defaultActiveKey="human">
                                    <Nav className="session-tab" variant="pills" >
                                        <Nav.Item >
                                            <Nav.Link eventKey="human"><i className="mr-2 fas fa-male"></i>Human</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link disabled eventKey="mouse"> <i className="mr-2 fa fa-fw mouse-icon"></i>Mouse</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="human" className="mt-4">
                                            <DatasetSection />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    </Element>

                    <Element className="pt-6" name={`cellline_${suffix}`}>
                        <h4 className="text-left mt-4 mb-3"><i className="mr-2 fas ordino-icon-2 fa-database" ></i> Cell Lines</h4>
                        <Card className="shadow-sm">
                            <Card.Body className="p-3">
                                <Tab.Container defaultActiveKey="human">
                                    <Nav className="session-tab" variant="pills">
                                        <Nav.Item >
                                            <Nav.Link eventKey="human"><i className="mr-2 fas fa-male"></i>Human</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link disabled eventKey="mouse"> <i className="mr-2 fa fa-fw mouse-icon"></i>Mouse</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Row className="pt-4">
                                        <Col >
                                            <Tab.Content>
                                                <Tab.Pane eventKey="human">
                                                    <DatasetSection />
                                                </Tab.Pane>
                                            </Tab.Content>

                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    </Element>

                    <Element className="pt-6" name={`tissue_${suffix}`}>
                        <h4 className="text-left mt-4 mb-3"><i className="mr-2 ordino-icon-2 fas fa-database" ></i> Tissues</h4>
                        <Card className="shadow-sm">
                            <Card.Body className="p-3">
                                <Tab.Container defaultActiveKey="human">
                                    <Nav className="session-tab" variant="pills">
                                        <Nav.Item >
                                            <Nav.Link eventKey="human"><i className="mr-2 fas fa-male"></i>Human</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link disabled eventKey="mouse"> <i className="mr-2 fa fa-fw mouse-icon"></i>Mouse</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Row className="pt-4">
                                        <Col >
                                            <Tab.Content>
                                                <Tab.Pane eventKey="human">
                                                    <DatasetSection />
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    </Element>

                    <Element className="py-6" name={`upload_${suffix}`}>
                        <h4 className="text-left mt-4 mb-3"><i className="mr-2 ordino-icon-2 fas fa-file-upload" ></i> Upload</h4>
                        <Card className="shadow-sm">
                            <Card.Body className="p-3">
                                <DatasetDropzone />
                                <Tab.Container defaultActiveKey="myDatasets">
                                    <Nav className="session-tab mt-4" variant="pills">
                                        <Nav.Item >
                                            <Nav.Link eventKey="myDatasets"><i className="mr-2 fas fa-user"></i>My Datasets</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="publicDatasets"> <i className="mr-2 fas fa-users"></i>Public Datasets</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="myDatasets" className="mt-4">
                                            <UploadedItem accessType="public" name="anylysis_dataset" uploadedDate="Mon, 10 Aug 2020" />
                                            <UploadedItem accessType="private" name="crispr_dataset" uploadedDate="Mon, 10 Sep 2020" description="This is an optional description for the dataset file" />
                                            <UploadedItem accessType="public" uploadedDate="Mon, 10 Nov 2020" name="crispr_dataset" />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="publicDatasets" className="mt-4" >
                                            <UploadedItem accessType="public" name="crispr_dataset" uploadedDate="Mon, 10 Aug 2020" />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    </Element>
                </Col>
            </Row>
        </Container >
    );
}
