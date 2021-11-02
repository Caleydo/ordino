import React from 'react';

export function BurgerMenu ({
  extensions: {sidebar = null}
}: {
  extensions: {
      sidebar: React.ReactElement | null;
  };
}) {
  return (
    <button className="btn btn-light bg-transparent border-0" type="button">
        <i className="fas fa-bars text-light"></i>
    </button>
  );
}
