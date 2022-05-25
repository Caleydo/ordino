import React from 'react';
const FloatingActionButton = ({ onClick, children, disabled = false, active = false }) => {
    const classes = ['btn', 'btn-primary'];
    if (active)
        classes.push('btn-info');
    if (disabled)
        classes.push('disabled');
    return (React.createElement("button", { className: classes.join(' '), onClick: onClick, disabled: disabled }, children));
};
export default FloatingActionButton;
//# sourceMappingURL=FloatingActionButton.js.map