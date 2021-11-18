import React from 'react';

export interface IBurgerMenuProps {
  sidebar: React.ReactElement | null;
}

export function BurgerMenu({
  sidebar = null
}: IBurgerMenuProps) {
  return (
    <li className="nav-item">
      <button className="btn nav-link btn-light bg-transparent border-0" type="button">
        <i className="fas fa-bars text-light"></i>
      </button>
    </li>
  );
}
