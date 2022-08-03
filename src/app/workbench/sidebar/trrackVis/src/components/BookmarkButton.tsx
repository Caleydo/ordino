import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBookmark } from '@fortawesome/free-solid-svg-icons';

export function BookmarkButton<S extends string, A>({ onClick, isBookmarked, color }: { onClick: () => void; isBookmarked: boolean; color: string }) {
  const [isHover, setHover] = useState<boolean>(false);
  return (
    <div
      style={{
        marginRight: '5px',
        color: isBookmarked || isHover ? color : 'lightgray',
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* <FontAwesomeIcon icon={faBookmark} /> */}
      <i className="fas fa-bookmark" />
    </div>
  );
}
