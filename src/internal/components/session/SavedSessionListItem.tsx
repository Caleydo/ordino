import {I18nextManager, IProvenanceGraphDataDescription} from 'phovea_core';
import React from 'react';
import {Button, Col, Dropdown, Row} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ProvenanceGraphMenuUtils, TDPApplicationUtils} from 'tdp_core';
import {ListItemDropdown} from '../common/ListItemDropdown';

interface ISavedSessionListItemProps {
  value: IProvenanceGraphDataDescription | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
  deleteSession: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
  editSession: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
  cloneSession: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
  exportSession: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
}

export function SavedSessionListItem({status, value, error, editSession,cloneSession,exportSession,deleteSession}: ISavedSessionListItemProps) {
  const dateFromNow = value?.ts ? TDPApplicationUtils.fromNow(value.ts) : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
console.log(value.name)
  return (
    <>
      {status === 'success' &&
        <Row className="dropdown-parent session-item mx-0 mb-1 align-items-start">
          <Col md={10} className="d-flex flex-column px-0 align-items-start">
            <Button variant="link" className="pl-0" style={{color: '#337AB7'}}>
              <i className="mr-2 fas fa-cloud" ></i>
              {value.name}
            </Button>
            {value.description ? <p className="ml-4">{value.description} </p> : null}
            <Row className="pr-0 pl-4  align-self-stretch">
              <Col md={6}>
                {dateFromNow ? <p className="flex-grow-1 text-muted">{dateFromNow} </p> : null}
              </Col>
              <Col md={6}>
                {ProvenanceGraphMenuUtils.isPublic(value) ?
                  <p className="text-muted flex-grow-1" title={I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status')}>
                    <i className="mr-2 fas fa-users"></i>Public access
               </p> :
                  <p className="text-muted flex-grow-1" title={I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status', {context: 'private'})}>
                    <i className="mr-2 fas fa-user"></i>Private access
              </p>}
              </Col>
            </Row>
          </Col>
          <Col md={2} className="d-flex justify-content-end mt-1 px-0">
            <Button variant="outline-secondary" onClick={(event) => editSession(event, value)} className="mr-2 pt-1 pb-1">Edit</Button>
            <ListItemDropdown>
              <Dropdown.Item onClick={(event) => cloneSession(event, value)}>Clone</Dropdown.Item>
              <Dropdown.Item onClick={(event) => exportSession(event, value)}>Export</Dropdown.Item>
              <Dropdown.Item className="dropdown-delete" onClick={(event) => deleteSession(event, value)}>Delete</Dropdown.Item>
            </ListItemDropdown>
          </Col>
        </Row>
      }
      {status === 'error' && <div>{error}</div>}
    </>
  );
}
