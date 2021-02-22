import {UserSession} from 'phovea_core';
import React from 'react';
import {Button, ButtonGroup, Col, Dropdown} from 'react-bootstrap';
import {INamedSet} from 'tdp_core';
import {SESSION_KEY_NEW_ENTRY_POINT} from '../..';
import {GraphContext} from '../../menu/StartMenuReact';
import {ListItemDropdown} from '../common/ListItemDropdown';

interface INamedSetListProps {
  headerIcon: string;
  headerText: string;
  value: INamedSet[] | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
  onclick?: () => null;
  readonly?: boolean;
}

export function NamedSetList({headerIcon, headerText, value, status, error, readonly}: INamedSetListProps) {

  const {manager} = React.useContext(GraphContext);

  const initNewSession = (event, view: string, options: any, defaultSessionValues: any = null) => {
    event.preventDefault();
    UserSession.getInstance().store(SESSION_KEY_NEW_ENTRY_POINT, {
      view,
      options,
      defaultSessionValues
    });
    manager.newGraph();
  };


  return (
    <Col md={4} className="dataset-entry d-flex flex-column" >
      <header><i className={`mr-2 ${headerIcon}`}></i>{headerText}</header>
      {status === 'success' &&
        <ButtonGroup vertical>
          {value.map((entry, i) => {
            return (
              <ButtonGroup key={i} className="dropdown-parent justify-content-between" >
                <Button className="text-left pl-0" style={{color: '#337AB7'}} variant="link" onClick={(event) => initNewSession(event, 'celllinedb_start', value)} >{entry.name}</Button>
                { readonly ||
                  <ListItemDropdown>
                    <Dropdown.Item>Edit</Dropdown.Item>
                    <Dropdown.Item className="dropdown-delete">Delete</Dropdown.Item>
                  </ListItemDropdown>
                }
              </ButtonGroup>);
          })}
        </ButtonGroup>
      }
      {status === 'error' && <div>{error}</div>}
    </Col>
  );
}
