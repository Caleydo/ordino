import * as React from 'react';

export function BreadcrumbSvgPathOnly({ color = 'cornflowerblue' }: { color?: string }) {
  return (
    <svg style={{ width: '100%', height: '100%', fill: color }} viewBox="0 0 160 180">
      <path d="M 0 0 L 40 90 L 0 180 H 120 l 40 -90 l -40 -90 H -120" />
    </svg>
  );
}
