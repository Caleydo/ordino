import * as React from 'react';

export function ConfigMenuOptions() {
  return (
    <div
      className="dropdown-menu dropdown-menu-end"
      aria-labelledby="userMenuDropdown"
    >
      <button className="dropdown-item">Logout</button>
      <button className="dropdown-item">Or dont</button>
      <button className="dropdown-item">Please</button>
      <button className="dropdown-item">Stay</button>
    </div>
  );
}
