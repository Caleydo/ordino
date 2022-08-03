import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBookmark } from '@fortawesome/free-solid-svg-icons';
export function BookmarkButton({ onClick, isBookmarked, color }) {
    const [isHover, setHover] = useState(false);
    return (React.createElement("div", { style: {
            marginRight: '5px',
            color: isBookmarked || isHover ? color : 'lightgray',
        }, onClick: onClick, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) },
        React.createElement("i", { className: "fas fa-bookmark" })));
}
//# sourceMappingURL=BookmarkButton.js.map