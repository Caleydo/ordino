import React from 'react';
export function SidebarButton({ isSelected, color, onClick, icon, extensions: { Badge } = { Badge: null } }) {
    return (React.createElement("button", { className: `btn rounded-0 shadow-none position-relative ${isSelected ? 'btn-icon-light' : 'btn-icon-dark'}`, type: "button", onClick: () => (isSelected ? onClick(null) : onClick('add')), style: { backgroundColor: isSelected ? color : 'transparent' } },
        React.createElement("i", { className: icon }),
        Badge ? React.createElement(Badge, null) : null));
}
//# sourceMappingURL=SidebarButton.js.map