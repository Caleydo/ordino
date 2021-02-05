import React from "react"
import {Container, Button, ButtonGroup, Card, Col, Dropdown, Nav, Row, Tab} from 'react-bootstrap'



interface ISessionItemProps {
    title: string;
    icon?: string;
}


export const SessionItem = ({title}: ISessionItemProps) => {
    return (
        <>
            <Row className="align-items-center">
                <Col md={10}>
                    <Button variant="link" >
                        <i className="mr-2 fas fa-history" ></i>{title}
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
                    <p className="ml-5 text-muted">
                        1 hour ago
                    </p>
                </Col >
            </Row>
            <hr />
        </>
    )
}