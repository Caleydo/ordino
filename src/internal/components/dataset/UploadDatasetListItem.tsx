import React from 'react';
import {Button, Col, Dropdown, Row} from 'react-bootstrap';
import {ListItemDropdown} from '../common/ListItemDropdown';

interface IUploadDatasetListItemProps {
  name: string;
  accessType: 'public' | 'private';
  description?: string;
  uploadedDate?: string;
  fileIcon?: string;
  onClick?: () => void;
}

export function UploadDatasetListItem({name, accessType, uploadedDate, description}: IUploadDatasetListItemProps) {
  return (
    <>
      <Row className="dropdown-parent session-item mx-0 mb-1 align-items-start">
        <Col md={11} className="d-flex px-0 flex-column align-items-start">
          <Button variant="link" className="pl-0" style={{color: '#337AB7'}} >
            <i className="mr-2 fas fa-file-csv" ></i>
            {name}
          </Button>
          {description ? <p className="pl-3">{description} </p> : null}
          <Row className="pl-5 justify-content-start  align-self-stretch">
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
        <Col md={1} className="d-flex px-0 mt-1 justify-content-end">
          <ListItemDropdown>
            <Dropdown.Item >Edit</Dropdown.Item>
            <Dropdown.Item className="dropdown-delete" >Delete</Dropdown.Item>
          </ListItemDropdown>
        </Col>
      </Row>
    </>
  );
}
