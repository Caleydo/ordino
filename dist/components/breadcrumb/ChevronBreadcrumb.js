import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../..';
import { animated } from 'react-spring';
export function ChevronBreadcrumb({ width = 50, height = 40, chevronIndent = 8, first = false, margin = 4, color = 'cornflowerblue' }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    // const spring = useSpring({width: width - chevronIndent - margin});
    return (React.createElement("svg", { className: `position-absolute chevronSvg`, style: { height: `${height}px` } }, first ?
        React.createElement(animated.path, { d: `M 0 0 V ${height} H ${width - chevronIndent - margin} l ${chevronIndent} ${-height / 2} l -${chevronIndent} ${-height / 2} H -${width - chevronIndent - margin}`, stroke: "1px solid black", fill: color })
        : React.createElement(animated.path, { d: `M 0 0 L ${chevronIndent} ${height / 2} L 0 ${height} H ${width - chevronIndent - margin} l ${chevronIndent} ${-height / 2} l -${chevronIndent} ${-height / 2} H -${width - chevronIndent - margin}`, stroke: "1px solid black", fill: color })));
}
//# sourceMappingURL=ChevronBreadcrumb.js.map