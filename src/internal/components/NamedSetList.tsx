import React from 'react';
import {Button, ButtonGroup, Col, Dropdown} from 'react-bootstrap';
import {useAsync} from '../../hooks';
import {INamedSet, IStoredNamedSet} from 'tdp_core';
import {ListItemDropdown} from './ListItemDropdown';

interface INamedSetListProps {
  headerIcon: string;
  headerText: string;
  loadEntries: () => Promise<INamedSet[]>;
  onclick?: () => null;
  readonly?: boolean;
}

export function NamedSetList({headerIcon, headerText, loadEntries, readonly}: INamedSetListProps) {
  const { status, value, error } = useAsync<INamedSet[]>(loadEntries);

  return (
    <Col md={4} className="dataset-entry d-flex flex-column" >
      <header><i className={`mr-2 ${headerIcon}`}></i>{headerText}</header>
      {status === 'success' &&
        <ButtonGroup vertical>
          {value.map((entry, i) => {
            return (
              <ButtonGroup key={i} className="dropdown-parent justify-content-between" >
                <Button className="text-left pl-0" style={{color: '#337AB7'}} variant="link" >{entry.name}</Button>
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
