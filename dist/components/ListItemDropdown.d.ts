import React from 'react';
import { Dropdown } from 'react-bootstrap';
interface IListItemDropdownProps {
    children?: Dropdown['Item'] | Dropdown['Item'][] | React.ReactNode;
}
export declare const ListItemDropdown: React.ForwardRefExoticComponent<IListItemDropdownProps & React.RefAttributes<unknown>>;
export {};
