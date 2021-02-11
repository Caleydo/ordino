import React from 'react';
import {Button, Col, Dropdown, Row} from 'react-bootstrap';
import {DatasetEntryDropdown} from './DatasetSection';


interface IUploadedItemProps {
    name: string;
    accessType: 'public' | 'private';
    description?: string;
    uploadedDate?: string;
    fileIcon?: string;
    onClick?: () => void;
}


export function UploadedItem({name, accessType, uploadedDate, description}: IUploadedItemProps) {
    return (
        <>
            <Row className="uploaded-dataset-item align-items-center">
                <Col md={11} className="d-flex flex-column align-items-start">
                    <Button variant="link" style={{color: '#337AB7'}} >
                        <i className="mr-2 fas fa-file-csv" ></i>{name}
                    </Button>

                    {description ? <p className="pl-2">{description} </p> : null}
                    <Row className="pl-4 justify-content-start  align-self-stretch">
                        {uploadedDate ? <p className="flex-grow-1 text-muted">{uploadedDate} </p> : null}
                        {accessType === 'public' ?
                            <p className="text-muted flex-grow-1">
                                <i className="mr-2 fas fa-users"></i>Public access
                             </p> :
                            <p className="text-muted flex-grow-1">
                                <i className="mr-2 fas fa-user"></i>Private access
                            </p>}
                    </Row>
                </Col>
                <Col md={1} className="d-flex align-self-center">
                    < DatasetEntryDropdown>
                        <Dropdown.Item >Edit</Dropdown.Item>
                        <Dropdown.Item className="dropdown-delete" >Delete</Dropdown.Item>
                    </ DatasetEntryDropdown>
                </Col>
            </Row>
            <hr className="mb-1 mt-0" />
        </>
    );
}


interface ICurrentItemProps {
    name: string;
    description?: string;
    uploadedDate?: string;
    fileIcon?: string;
    onClick?: () => void;
}



export function CurrentItem({name, uploadedDate, description}: ICurrentItemProps) {
    return (
        <>
            <Row className="uploaded-dataset-item align-items-center">
                <Col md={10} className="d-flex flex-column align-items-start">
                    <Button className="pl-0" style={{color: '#337AB7'}} variant="link" >
                        <i className="mr-2 fas fa-history" ></i>{name}
                    </Button>
                    {description ? <p className="ml-4">{description} </p> : null}
                    {uploadedDate ? <p className="ml-4 text-muted">{uploadedDate} </p> : null}
                </Col>
                <Col md={2} className="d-flex align-self-center">
                    <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Save</Button>
                    < DatasetEntryDropdown>
                        <Dropdown.Item >Clone</Dropdown.Item>
                        <Dropdown.Item >Export</Dropdown.Item>
                        <Dropdown.Item className="dropdown-delete" >Delete</Dropdown.Item>
                    </ DatasetEntryDropdown>
                </Col>
            </Row>
            <hr className="mb-1 mt-0" />
        </>
    );
}


interface ISavedItemProps {
    name: string;
    description?: string;
    uploadedDate?: string;
    accessType: 'public' | 'private';
    fileIcon?: string;
    onClick?: () => void;
}


export function SavedItem({name, uploadedDate, accessType, description}: ISavedItemProps) {
    return (
        <>
            <Row className="uploaded-dataset-item align-items-center">
                <Col md={10} className="d-flex flex-column align-items-start">
                    <Button variant="link" style={{color: '#337AB7'}}>
                        <i className="mr-2 fas fa-cloud" ></i>{name}
                    </Button>
                    {description ? <p className="ml-4">{description} </p> : null}
                    <Row className="ml-4 justify-content-start  align-self-stretch">
                        <Col md={6}>
                            {uploadedDate ? <p className="flex-grow-1 text-muted">{uploadedDate} </p> : null}
                        </Col>
                        <Col md={6}>
                            {accessType === 'public' ?
                                <p className="text-muted flex-grow-1">
                                    <i className="mr-2 fas fa-users"></i>Public access
                             </p> :
                                <p className="text-muted flex-grow-1">
                                    <i className="mr-2 fas fa-user"></i>Private access
                            </p>}
                        </Col>
                    </Row>
                </Col>
                <Col md={2} className="d-flex align-self-center">
                    <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Edit</Button>
                    < DatasetEntryDropdown>
                        <Dropdown.Item >Clone</Dropdown.Item>
                        <Dropdown.Item >Export</Dropdown.Item>
                        <Dropdown.Item className="dropdown-delete" >Delete</Dropdown.Item>
                    </ DatasetEntryDropdown>
                </Col>
            </Row>
            <hr className="mb-1 mt-0" />
        </>
    );
}
