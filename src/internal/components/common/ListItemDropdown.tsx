import React from 'react';
import {ButtonGroup, Dropdown} from 'react-bootstrap';

interface IListItemDropdownProps {
  children?: Dropdown['Item'] | Dropdown['Item'][] | React.ReactNode;
}

export function ListItemDropdown(props: IListItemDropdownProps) {
  return (
    <Dropdown vertical className="list-item-dropdown" as={ButtonGroup}>
      <Dropdown.Toggle variant="link"><i className="fas fa-ellipsis-v "></i></Dropdown.Toggle>
      <Dropdown.Menu>
        {props.children}
      </Dropdown.Menu>
    </Dropdown>
  );
}
