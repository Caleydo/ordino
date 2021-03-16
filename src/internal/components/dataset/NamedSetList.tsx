import React from 'react';
import {Button, ButtonGroup, Col, Dropdown} from 'react-bootstrap';
import {INamedSet} from 'tdp_core';
import {SESSION_KEY_NEW_ENTRY_POINT} from '../..';
import {ListItemDropdown} from '../common';
import {GraphContext} from '../../OrdinoAppComponent';
import {UserSession} from 'phovea_core';

interface INamedSetListProps {
  headerIcon: string;
  headerText: string;
  namedSets: INamedSet[] | null;
  startViewId: string;
  status: 'idle' | 'pending' | 'success' | 'error';
  readonly?: boolean;
}

export function NamedSetList({headerIcon, headerText, startViewId, namedSets, status, readonly}: INamedSetListProps) {
  const {manager} = React.useContext(GraphContext);

  // TODO: refactor init session handling
  const startAnalyis = (event: React.MouseEvent<HTMLElement, MouseEvent>, namedSet: INamedSet) => {
    event.preventDefault();
    const defaultSessionValues = {
      ['species']: 'human' // TODO: refactor to get the value as props
    };

    UserSession.getInstance().store(SESSION_KEY_NEW_ENTRY_POINT, {
      view: startViewId,
      options: {namedSet},
      defaultSessionValues
    });
    manager.newGraph();
  };

  return (
    <Col md={4} className="dataset-entry d-flex flex-column" >
      <header><i className={`mr-2 ${headerIcon}`}></i>{headerText}</header>
      {status === 'pending' &&
        <p><i className="fas fa-circle-notch fa-spin"></i> Loading sets...</p>
      }
      {status === 'success' &&
        namedSets.length === 0 &&
        <p>No sets available</p>
      }
      {status === 'success' &&
        namedSets.length > 0 &&
        <ButtonGroup vertical>
          {namedSets.map((namedSet, i) => {
            return (
              <ButtonGroup key={i} className="dropdown-parent justify-content-between" >
                <Button className="text-left pl-0" style={{color: '#337AB7'}} variant="link" onClick={(event) => startAnalyis(event, namedSet)} >{namedSet.name}</Button>
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
