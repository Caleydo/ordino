import * as React from 'react';
export function BreadcrumbSvgPathOnly({ 
// Numbers here are all in pixels
width = 1500, height = 40, chevronIndent = 8, margin = 4, isFirst = false, color = 'cornflowerblue', }) {
    return (React.createElement("svg", { className: "position-absolute chevronSvg", style: { height: `${height}px` } }, isFirst ? (React.createElement("path", { d: `M 0 0 V ${height} H ${width - chevronIndent - margin} l ${chevronIndent} ${-height / 2} l -${chevronIndent} ${-height / 2} H -${width - chevronIndent - margin}`, stroke: "1px solid black", fill: color })) : (React.createElement("path", { d: `M 0 0 L ${chevronIndent} ${height / 2} L 0 ${height} H ${width - chevronIndent - margin} l ${chevronIndent} ${-height / 2} l -${chevronIndent} ${-height / 2} H -${width - chevronIndent - margin}`, stroke: "1px solid black", fill: color }))));
}
//# sourceMappingURL=BreadcrumbSvgPathOnly.js.map