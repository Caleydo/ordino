import React from 'react';
import {ButtonGroup, Dropdown} from 'react-bootstrap';

interface IListItemDropdownProps {
  children?: Dropdown['Item'] | Dropdown['Item'][] | React.ReactNode;
}

// tslint:disable-next-line: variable-name
export const ListItemDropdown = React.forwardRef((props: IListItemDropdownProps, ref) => {
  return (
    <Dropdown ref={ref} vertical className="list-item-dropdown" as={ButtonGroup}>
      <Dropdown.Toggle variant="link"><i className="fas fa-ellipsis-v "></i></Dropdown.Toggle>
      <Dropdown.Menu >
        {props.children}
      </Dropdown.Menu>
    </Dropdown>
  );
});
