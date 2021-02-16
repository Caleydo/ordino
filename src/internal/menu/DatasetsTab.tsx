import React from 'react';
import {Container, Col, Nav, Row, Button} from 'react-bootstrap';
import {Link, Element} from 'react-scroll';
import {UniqueIdManager} from 'phovea_core';
import {DatasetCard, UploadDatasetCard} from '../components';


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
                        <DatasetCard id="genes" title="Genes" faIcon="fas fa-database"></DatasetCard>
                    </Element>

                    <Element className="pt-6" name={`celllines_${suffix}`}>
                        <DatasetCard id="celllines" title="Cell Lines" faIcon="fas fa-database"></DatasetCard>
                    </Element>

                    <Element className="pt-6" name={`tissues_${suffix}`}>
                        <DatasetCard id="tissues" title="Tissues" faIcon="fas fa-database"></DatasetCard>
                    </Element>

                    <Element className="py-6" name={`upload_${suffix}`}>
                        <UploadDatasetCard id="upload" title="Upload" faIcon="fas fa-file-upload"></UploadDatasetCard>
                    </Element>
                </Col>
            </Row>
        </Container >
    );
}
