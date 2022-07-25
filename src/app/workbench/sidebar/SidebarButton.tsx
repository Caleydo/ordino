import React from 'react';

export function SidebarButton({ isSelected, color, onClick, icon }: { isSelected: boolean; color: string; onClick: (s: string) => void; icon: string }) {
  return (
    <button
      className={`btn rounded-0 shadow-none ${isSelected ? 'btn-icon-light' : 'btn-icon-dark'}`}
      type="button"
      onClick={() => (isSelected ? onClick(null) : onClick('add'))}
      style={{ backgroundColor: isSelected ? color : 'transparent' }}
    >
      <i className={icon} />
    </button>
  );
}
