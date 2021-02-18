import React from 'react';
import {Button, Col, Dropdown, Row} from 'react-bootstrap';
import {ListItemDropdown} from '../common/ListItemDropdown';

interface ICurrentSessionListItemProps {
  name: string;
  description?: string;
  uploadedDate?: string;
  fileIcon?: string;
  onClick?: () => void;
}

export function CurrentSessionListItem({name, uploadedDate, description}: ICurrentSessionListItemProps) {
  return (
    <>
      <Row className="dropdown-parent session-item mx-0 mb-1  align-items-start">
        <Col md={10} className="d-flex flex-column px-0  align-items-start">
          <Button className="pl-0" style={{color: '#337AB7'}} variant="link" >
            <i className="mr-2 fas fa-history" ></i>
            {name}
          </Button>
          {description ? <p className="ml-4">{description} </p> : null}
          {uploadedDate ? <p className="ml-4 text-muted">{uploadedDate} </p> : null}
        </Col>
        <Col md={2} className="d-flex px-0 mt-1 justify-content-end">
          <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Save</Button>
          <ListItemDropdown>
            <Dropdown.Item >Clone</Dropdown.Item>
            <Dropdown.Item >Export</Dropdown.Item>
            <Dropdown.Item className="dropdown-delete" >Delete</Dropdown.Item>
          </ListItemDropdown>
        </Col>
      </Row>
    </>
  );
}
