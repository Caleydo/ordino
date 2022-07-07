import * as React from 'react';

export function AnimatingOverlay({ iconName, isAnimating, color }: { iconName: string; isAnimating: boolean; color: string }) {
  return (
    <div className={`inner m-0 p-0 bg-white justify-content-center align-items-center ${!isAnimating ? 'd-none' : ''} d-flex`}>
      <i className={iconName} style={{ fontSize: '80px', color }} />
    </div>
  );
}
