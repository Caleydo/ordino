import {I18nextManager, IProvenanceGraphDataDescription} from 'phovea_core';
import React from 'react';
import {Button, Col, Dropdown, Row} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ProvenanceGraphMenuUtils, TDPApplicationUtils} from 'tdp_core';
import {ListItemDropdown} from '../common/ListItemDropdown';

interface ISessionListItemProps {
  value: IProvenanceGraphDataDescription | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
  deleteSession?: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
  editSession?: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
  cloneSession?: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
  exportSession?: (event: React.MouseEvent<DropdownItemProps>, value: IProvenanceGraphDataDescription) => void;
  children?: React.ReactNode;
}

export function SessionListItem({status, value, error, editSession, cloneSession, exportSession, deleteSession, children}: ISessionListItemProps) {
  const dateFromNow = value?.ts ? TDPApplicationUtils.fromNow(value.ts) : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
  return (
    <>
      {status === 'success' &&
        <Row className="dropdown-parent session-item mx-0 mb-1 align-items-start">
          <Col md={10} className="d-flex flex-column px-0 align-items-start">
            <Button variant="link" className="pl-0" style={{color: '#337AB7'}}>
              <i className={`mr-2 fas ${value.local ? 'fa-history' : 'fa-cloud'}`}></i>
              {value.name}
            </Button>
            {value.description ? <p className="ml-4">{value.description} </p> : null}
            <Row className="pr-0 pl-4  align-self-stretch">
              <Col md={6}>
                {dateFromNow ? <p className="flex-grow-1 text-muted">{dateFromNow} </p> : null}
              </Col>
              {value.local ? null :
                <Col md={6}>
                  {ProvenanceGraphMenuUtils.isPublic(value) ?
                    <p className="text-muted flex-grow-1" title={I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status')}>
                      <i className="mr-2 fas fa-users"></i>Public access
               </p> :
                    <p className="text-muted flex-grow-1" title={I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status', {context: 'private'})}>
                      <i className="mr-2 fas fa-user"></i>Private access
              </p>}
                </Col>
              }
            </Row>
          </Col>
          <Col md={2} className="d-flex justify-content-end mt-1 px-0">
           {children}
          </Col>
        </Row>
      }
      {status === 'error' && <div>{error}</div>}
    </>
  );
}
