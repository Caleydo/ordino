import * as React from 'react';
import { useSpring, useSprings, animated } from 'react-spring';
import { useAppDispatch, useAppSelector } from '../..';

export interface IChevronBreadcrumbProps {
  width?: number;
  chevronIndent?: number;
  first?: boolean;
  height?: number;
  color?: string;
  margin?: number;
}

export function ChevronBreadcrumb({
  width = 50,
  height = 40,
  chevronIndent = 8,
  first = false,
  margin = 4,
  color = 'cornflowerblue',
}: IChevronBreadcrumbProps) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();

  // const spring = useSpring({width: width - chevronIndent - margin});

  return (
    <svg className="position-absolute chevronSvg" style={{ height: `${height}px` }}>
      {first ? (
        <animated.path
          d={`M 0 0 V ${height} H ${width - chevronIndent - margin} l ${chevronIndent} ${-height / 2} l -${chevronIndent} ${-height / 2} H -${
            width - chevronIndent - margin
          }`}
          stroke="1px solid black"
          fill={color}
        />
      ) : (
        <animated.path
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
