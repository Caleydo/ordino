import React from 'react';
import Select from 'react-select';
import {Container, Button, ButtonGroup, Card, Col, Dropdown, Nav, Row, Tab} from 'react-bootstrap';

interface IDatasetSearchBoxProps {

}


export function DatasetSearchBox({ }: IDatasetSearchBoxProps) {
    const options = [
        {value: 'chocolate', label: 'Chocolate'},
        {value: 'strawberry', label: 'Strawberry'},
        {value: 'vanilla', label: 'Vanilla'}
    ];
    return (
        <Row>
            <Col >
                <Select isMulti={true} options={options} />
            </Col>
            <Button variant="secondary" className="mr-2 pt-1 pb-1">Open</Button>
            <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Save as set</Button>
        </Row>
    );
}

