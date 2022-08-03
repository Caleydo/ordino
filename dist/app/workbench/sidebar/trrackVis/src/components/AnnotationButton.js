import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit } from '@fortawesome/free-solid-svg-icons';
export function AnnotationButton({ onClick, isAnnotating, color }) {
    const [isHover, setHover] = useState(false);
    return (React.createElement("div", { style: {
            marginRight: '5px',
            color: isAnnotating || isHover ? color : 'lightgray',
        }, onClick: onClick, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) },
        React.createElement("i", { className: "fas fa-edit" })));
}
//# sourceMappingURL=AnnotationButton.js.map