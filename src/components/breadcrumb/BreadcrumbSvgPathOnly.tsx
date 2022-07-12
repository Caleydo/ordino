import * as React from 'react';

export function BreadcrumbSvgPathOnly({
  // Numbers here are all in pixels
  width = 1500,
  height = 40,
  chevronIndent = 8,
  margin = 4,
  isFirst = false,
  color = 'cornflowerblue',
}: {
  width?: number;
  // chevronIndent is the width of the triangle at the beginning and end of the chevron. Higher number looks "sharper"
  chevronIndent?: number;
  isFirst?: boolean;
  height?: number;
  color?: string;
  // distance between chevrons
  margin?: number;
}) {
  return (
    <svg className="position-absolute chevronSvg" style={{ height: `${height}px` }}>
      {isFirst ? (
        <path
          d={`M 0 0 V ${height} H ${width - chevronIndent - margin} l ${chevronIndent} ${-height / 2} l -${chevronIndent} ${-height / 2} H -${
            width - chevronIndent - margin
          }`}
          stroke="1px solid black"
          fill={color}
        />
      ) : (
        <path
          d={`M 0 0 L ${chevronIndent} ${height / 2} L 0 ${height} H ${width - chevronIndent - margin} l ${chevronIndent} ${-height / 2} l -${chevronIndent} ${
            -height / 2
          } H -${width - chevronIndent - margin}`}
          stroke="1px solid black"
          fill={color}
        />
      )}
    </svg>
  );
}
