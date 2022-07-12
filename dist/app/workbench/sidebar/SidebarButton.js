import React from 'react';
export function SidebarButton({ isSelected, color, onClick, icon }) {
    return (React.createElement("button", { className: `btn rounded-0 shadow-none ${isSelected ? 'btn-icon-light' : 'btn-icon-dark'}`, type: "button", onClick: () => (isSelected ? onClick(null) : onClick('add')), style: { backgroundColor: isSelected ? color : 'transparent' } },
        React.createElement("i", { className: icon })));
}
//# sourceMappingURL=SidebarButton.js.map