import {I18nextManager, IProvenanceGraphDataDescription} from 'phovea_core';
import React from 'react';
import {Button, Col, Dropdown, Row} from 'react-bootstrap';
import {ProvenanceGraphMenuUtils, TDPApplicationUtils} from 'tdp_core';
import {ListItemDropdown} from '../common/ListItemDropdown';

interface ISavedSessionListItemProps {
  value: IProvenanceGraphDataDescription | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
  description?: string;
}

export function SavedSessionListItem({status, value, error, description}: ISavedSessionListItemProps) {
  const dateFromNow = value?.ts ? TDPApplicationUtils.fromNow(value.ts) : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');

  return (
    <>
      {status === 'success' &&
        <Row className="dropdown-parent session-item mx-0 mb-1 align-items-start">
          <Col md={10} className="d-flex flex-column px-0 align-items-start">
            <Button variant="link" className="pl-0" style={{color: '#337AB7'}}>
              <i className="mr-2 fas fa-cloud" ></i>
              {value.name}
            </Button>
            {description ? <p className="ml-4">{description} </p> : null}
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
            <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Edit</Button>
            <ListItemDropdown>
              <Dropdown.Item >Clone</Dropdown.Item>
              <Dropdown.Item >Export</Dropdown.Item>
              <Dropdown.Item className="dropdown-delete" >Delete</Dropdown.Item>
            </ListItemDropdown>
          </Col>
        </Row>
      }
      {status === 'error' && <div>{error}</div>}
    </>
  );
}
