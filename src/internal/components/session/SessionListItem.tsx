import {I18nextManager, IProvenanceGraphDataDescription} from 'phovea_core';
import React, {useRef} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ErrorAlertHandler, FormDialog, NotificationHandler, ProvenanceGraphMenuUtils, TDPApplicationUtils} from 'tdp_core';

interface ISessionListItemProps {
  desc: IProvenanceGraphDataDescription | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
  children?: React.ReactNode;
}

export function SessionListItem({status, desc, error, children}: ISessionListItemProps) {
  const dateFromNow = desc?.ts ? TDPApplicationUtils.fromNow(desc.ts) : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
  console.log(desc);
  return (
    <>
      {status === 'success' &&
        <Row className="dropdown-parent session-item mx-0 mb-1 align-items-start">
          <Col md={10} className="d-flex flex-column px-0 align-items-start">
            <Button variant="link" className="pl-0" style={{color: '#337AB7'}}>
              <i className={`mr-2 fas ${desc.local ? 'fa-history' : 'fa-cloud'}`}></i>
              {desc.name}
            </Button>
            {desc.description ? <p className="ml-4">{desc.description} </p> : null}
            <Row  className="pr-0  align-self-stretch">
              <Col>
                {dateFromNow ? <p  className="flex-grow-1 ml-4 text-muted">{dateFromNow} </p> : null}
              </Col>
              {desc.local ? null :
                <Col >
                  {ProvenanceGraphMenuUtils.isPublic(desc) ?
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
