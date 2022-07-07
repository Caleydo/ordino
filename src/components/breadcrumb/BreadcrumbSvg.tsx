import * as React from 'react';
import { useMemo, useState } from 'react';

/**
 * Taken this from https://css-tricks.com/snippets/javascript/lighten-darken-color/ for the purpose of lightening our colors on hover
 * @param col color to darken
 * @param amt amount to darken. 0 does nothing, positive numbers darken, negative numbers lighten.
 * @returns
 */
function darkenColor(col, amt) {
  col = col.slice(1);
  amt = -amt;

  const num = parseInt(col, 16);

  // eslint-disable-next-line no-bitwise
  let r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  // eslint-disable-next-line no-bitwise
  let b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  // eslint-disable-next-line no-bitwise
  let g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  // eslint-disable-next-line no-bitwise
  return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
}

export function BreadcrumbSvg({
  width = 1500,
  height = 40,
  chevronIndent = 8,
  first = false,
  margin = 4,
  color = 'cornflowerblue',
  clickable = false,
  backgroundColor = 'white',
}: {
  width?: number;
  chevronIndent?: number;
  first?: boolean;
  height?: number;
  color?: string;
  margin?: number;
  clickable?: boolean;
  backgroundColor?: string;
}) {
  const [isHover, setHover] = useState<boolean>(false);

  const fillColor = useMemo(() => {
    return isHover && clickable ? darkenColor(color, 20) : color;
  }, [isHover, clickable, color]);

  return (
    <svg
      className="position-absolute chevronSvg"
      width={width}
      style={{ height: `${height}px` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <rect width={width - margin - chevronIndent} height={height} fill={fillColor} />
      <g transform={`translate(${width - chevronIndent - margin}, 0)`}>
        <path d={`m 0 ${height} l ${chevronIndent} -${height / 2} l -${chevronIndent} -${height / 2} z`} fill={fillColor} />
      </g>

      {!first ? (
        <g>
          <path d={`m 0 ${height} l ${chevronIndent} -${height / 2} l -${chevronIndent} -${height / 2} z`} fill={backgroundColor} />
        </g>
      ) : null}
    </svg>
  );
}
