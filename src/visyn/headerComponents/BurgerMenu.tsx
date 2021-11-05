import React from 'react';

export interface IBurgerMenuProps {
  sidebar: React.ReactElement | null;
}

export function BurgerMenu ({
  sidebar = null
}: IBurgerMenuProps) {
  return (
    <button className="btn btn-light bg-transparent border-0" type="button">
        <i className="fas fa-bars text-light"></i>
    </button>
  );
}
