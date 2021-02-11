import React from 'react';
import {Button, ButtonGroup, Col, Dropdown, Row, } from 'react-bootstrap';

import {DatasetSearchBox} from './DatasetSearchBox';



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




interface IDatasetEntriesProps {
    headerIcon: string;
    headerText: string;
    entries: string[];
    onclick?: () => null;
    readonly?: boolean;
}

function DatasetEntries({headerIcon, headerText, entries, readonly}: IDatasetEntriesProps) {
    return (
        <Col md={4} className="dataset-entry d-flex flex-column" >
            <header ><i className={`mr-2 ${headerIcon}`}></i>{headerText}</header>
            <ButtonGroup vertical>
                {entries.map((entry, i) => {
                    return (
                        <ButtonGroup key={i} className="justify-content-between" >
                            <Button className="text-left pl-0" style={{color: '#337AB7'}} variant="link" >{entry}</Button>
                            { readonly ||
                                <DatasetEntryDropdown>
                                    <Dropdown.Item >Edit</Dropdown.Item>
                                    <Dropdown.Item className="dropdown-delete" >Delete</Dropdown.Item>
                                </DatasetEntryDropdown>}
                        </ButtonGroup>);
                })}
            </ButtonGroup>
        </Col>
    );
}



interface IDatasetEntryDropdown {
    children?: React.ReactNode;

}

export function DatasetEntryDropdown(props: IDatasetEntryDropdown) {
    return (
        <Dropdown vertical className="session-dropdown" as={ButtonGroup}>
            <Dropdown.Toggle variant="link"><i className="fas fa-ellipsis-v " ></i></Dropdown.Toggle>
            <Dropdown.Menu>
                {props.children}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export function DatasetSection() {
    return (
        <>
            <DatasetSearchBox></DatasetSearchBox>
            <Row className="mt-4">
                <DatasetEntries headerIcon="fas fa-database" headerText="Predifined Sets" entries={genSets} readonly />
                <DatasetEntries headerIcon="fas fa-user" headerText="My Sets" entries={mySets} />
                <DatasetEntries headerIcon="fas fa-users" headerText="Public Sets" entries={publicSets} readonly />
            </Row>
        </>
    );
}
