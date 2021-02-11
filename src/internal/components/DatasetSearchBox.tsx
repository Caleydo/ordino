import React from 'react';
import Select from 'react-select';
import {Container, Button, ButtonGroup, Card, Col, Dropdown, Nav, Row, Tab} from 'react-bootstrap';

interface IDatasetSearchBoxProps {

}

export function DatasetSearchBox({ }: IDatasetSearchBoxProps) {
    const options = [
        {value: 'ABCD3', label: 'ABCD3'},
        {value: 'ABCD1', label: 'ABCF3'},
        {value: 'ABCD2', label: 'ABCD2'},
        {value: 'ABCD4', label: 'ABCF1'},
        {value: 'ABCD5', label: 'ABCD3'},
        {value: 'ABCD6', label: 'ABCG3'},
        {value: 'ABCD7', label: 'ABCG2'},
        {value: 'ABCD8', label: 'ABCH3'},
        {value: 'ABCD9', label: 'ABCM3'},

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

