import {I18nextManager, IProvenanceGraphDataDescription} from 'phovea_core';
import React from 'react';
import {Button, Col, Dropdown, Row} from 'react-bootstrap';
import {TDPApplicationUtils} from 'tdp_core';
import {GraphContext} from '../../menu/StartMenuReact';
import {ListItemDropdown} from '../common/ListItemDropdown';

interface ITemporarySessionListItemProps {
  value: IProvenanceGraphDataDescription | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
  description?: string;
}

export function TemporarySessionListItem({status, value, error, description}: ITemporarySessionListItemProps) {
  const {manager} = React.useContext(GraphContext);

  const dateFromNow = value?.ts ? TDPApplicationUtils.fromNow(value.ts) : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
  return (
    <>
      {status === 'success' &&
        <Row className="dropdown-parent session-item mx-0 mb-1  align-items-start">
          <Col md={10} className="d-flex flex-column px-0  align-items-start">
            <Button onClick={() => manager.loadGraph(value)} className="pl-0" style={{color: '#337AB7'}} variant="link" >
              <i className="mr-2 fas fa-history" ></i>
              {value.name}
            </Button>
            {description ? <p className="ml-4">{description} </p> : null}
            {dateFromNow ? <p className="ml-4 text-muted">{dateFromNow} </p> : null}
          </Col>
          <Col md={2} className="d-flex px-0 mt-1 justify-content-end">
            <Button variant="outline-secondary" className="mr-2 pt-1 pb-1">Save</Button>
            <ListItemDropdown>
              <Dropdown.Item >Clone</Dropdown.Item>
              <Dropdown.Item >Export</Dropdown.Item>
              <Dropdown.Item className="dropdown-delete" >Delete</Dropdown.Item>
            </ListItemDropdown>
          </Col>
        </Row>}
      {status === 'error' && <div>{error}</div>}
    </>
  );
}
