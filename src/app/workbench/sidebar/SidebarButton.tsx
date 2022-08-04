import React, { ComponentType } from 'react';

export interface ISidebarButtonProps {
  isSelected: boolean;
  color: string;
  onClick: (s: string) => void;
  icon: string;
  extensions?: {
    Badge?: ComponentType;
  };
}

export function SidebarButton({ isSelected, color, onClick, icon, extensions: { Badge } = { Badge: null } }: ISidebarButtonProps) {
  return (
    <button
      className={`btn rounded-0 shadow-none position-relative ${isSelected ? 'btn-icon-light' : 'btn-icon-dark'}`}
      type="button"
      onClick={() => (isSelected ? onClick(null) : onClick('add'))}
      style={{ backgroundColor: isSelected ? color : 'transparent' }}
    >
      <i className={icon} />
      {Badge ? <Badge /> : null}
    </button>
  );
}
