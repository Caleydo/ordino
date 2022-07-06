import * as React from 'react';

export function BreadcrumbSvg({
  width = 1500,
  height = 40,
  chevronIndent = 8,
  first = false,
  margin = 4,
  color = 'cornflowerblue',
}: {
  width?: number;
  chevronIndent?: number;
  first?: boolean;
  height?: number;
  color?: string;
  margin?: number;
}) {
  return (
    <svg className="position-absolute chevronSvg" width={width} style={{ height: `${height}px` }}>
      <rect width={width - margin - chevronIndent} height={height} fill={color} />
      <g transform={`translate(${width - chevronIndent - margin}, 0)`}>
        <path d={`m 0 ${height} l ${chevronIndent} -${height / 2} l -${chevronIndent} -${height / 2} z`} fill={color} />
      </g>

      {!first ? (
        <g>
          <path d={`m 0 ${height} l ${chevronIndent} -${height / 2} l -${chevronIndent} -${height / 2} z`} fill="white" />
        </g>
      ) : null}
    </svg>
  );
}
