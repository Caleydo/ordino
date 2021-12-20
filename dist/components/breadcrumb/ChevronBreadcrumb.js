import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../..';
export function ChevronBreadcrumb({ width = 50, chevronIndent = 8, first = false, margin = 4, color = 'cornflowerblue' }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    return (React.createElement("svg", { className: `position-absolute chevronSvg` }, first ?
        React.createElement("path", { d: `M 0 0 V 30 H ${width - chevronIndent - margin} l ${chevronIndent} -15 l -${chevronIndent} -15 H -${width - chevronIndent - margin}`, stroke: "1px solid black", fill: color })
        : React.createElement("path", { d: `M 0 0 L ${chevronIndent} 15 L 0 30 H ${width - chevronIndent - margin} l ${chevronIndent} -15 l -${chevronIndent} -15 H -${width - chevronIndent - margin}`, stroke: "1px solid black", fill: color })));
}
//# sourceMappingURL=ChevronBreadcrumb.js.map