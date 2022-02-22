import React from 'react';

interface IListItemDropdownProps {
  children?: React.ReactNode[];
}

// tslint:disable-next-line: variable-name
export const ListItemDropdown = React.forwardRef((props: IListItemDropdownProps, ref) => {
  return (
    <div className="dropdown btn-group-vertical list-item-dropdown">
      <button
        className="btn btn-link dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="fas fa-ellipsis-v" />
      </button>
      <div className="dropdown-menu" data-bs-popper="static" aria-labelledby="dropdownMenuButton">
        {props.children}
      </div>
    </div>
  );
});
