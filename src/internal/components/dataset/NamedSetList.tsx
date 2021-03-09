import React from 'react';
import {Button, ButtonGroup, Col, Dropdown} from 'react-bootstrap';
import {INamedSet} from 'tdp_core';
import {GraphContext} from '../../menu/StartMenuReact';
import {ListItemDropdown} from '../common';

interface INamedSetListProps {
  headerIcon: string;
  headerText: string;
  value: INamedSet[] | null;
  viewId: string;
  status: 'idle' | 'pending' | 'success' | 'error';
  error: Error | string | null;
  readonly?: boolean;
}

export function NamedSetList({headerIcon, headerText, viewId, value, status, error, readonly}: INamedSetListProps) {

  const {app} = React.useContext(GraphContext);
  const open = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    app.initNewSession(viewId, value)
  };

  return (
    <Col md={4} className="dataset-entry d-flex flex-column" >
      <header><i className={`mr-2 ${headerIcon}`}></i>{headerText}</header>
      {status === 'pending' &&
        <p><i className="fas fa-circle-notch fa-spin"></i> Loading sets...</p>
      }
      {status === 'success' &&
        value.length === 0 &&
        <p>No sets available</p>
      }
      {status === 'success' &&
        value.length > 0 &&
        <ButtonGroup vertical>
          {value.map((entry, i) => {
            return (
              <ButtonGroup key={i} className="dropdown-parent justify-content-between" >
                <Button className="text-left pl-0" style={{color: '#337AB7'}} variant="link" onClick={open} >{entry.name}</Button>
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
      {/* {status === 'error' && <p>{(typeof error === 'string') ? error : (error as Error)?.message}</p>} */}
      {status === 'error' && <p>Error when loading sets</p>}
    </Col>
  );
}
