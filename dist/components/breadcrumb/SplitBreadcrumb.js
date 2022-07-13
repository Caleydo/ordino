import * as React from 'react';
export function SplitBreadcrumb({ width = 1500, height = 40, chevronIndent = 8, first = false, margin = 4, color = 'cornflowerblue', }) {
    return (React.createElement("svg", { className: "position-absolute chevronSvg", width: width, style: { height: `${height}px` } },
        React.createElement("rect", { width: width - margin - chevronIndent, height: height, fill: color }),
        React.createElement("g", { transform: `translate(${width - chevronIndent - margin}, 0)` },
            React.createElement("path", { d: `m 0 ${height} l ${chevronIndent} -${height / 2} l -${chevronIndent} -${height / 2} z`, fill: color })),
        !first ? (React.createElement("g", null,
            React.createElement("path", { d: `m 0 ${height} l ${chevronIndent} -${height / 2} l -${chevronIndent} -${height / 2} z`, fill: "white" }))) : null));
}
//# sourceMappingURL=SplitBreadcrumb.js.map