import * as React from 'react';
import { useMemo, useState } from 'react';
/**
 * Taken this from https://css-tricks.com/snippets/javascript/lighten-darken-color/ for the purpose of darkening our colors on hover
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
    if (r > 255)
        r = 255;
    else if (r < 0)
        r = 0;
    // eslint-disable-next-line no-bitwise
    let b = ((num >> 8) & 0x00ff) + amt;
    if (b > 255)
        b = 255;
    else if (b < 0)
        b = 0;
    // eslint-disable-next-line no-bitwise
    let g = (num & 0x0000ff) + amt;
    if (g > 255)
        g = 255;
    else if (g < 0)
        g = 0;
    // eslint-disable-next-line no-bitwise
    return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
}
export function BreadcrumbSvg({ 
// Numbers here are all in pixels
width = 1500, height = 40, chevronIndent = 8, margin = 0, isFirst = false, color = 'cornflowerblue', isClickable = false, backgroundColor = 'white', }) {
    const [isHover, setHover] = useState(false);
    const fillColor = useMemo(() => {
        return isHover && isClickable ? darkenColor(color, 20) : color;
    }, [isHover, isClickable, color]);
    return (React.createElement("svg", { className: "position-absolute chevronSvg", width: width, style: { height: `${height}px` }, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) },
        React.createElement("rect", { width: width - margin - chevronIndent, height: height, fill: fillColor, rx: 3, ry: 3 }),
        React.createElement("g", { transform: `translate(${width - chevronIndent - margin}, 0)` },
            React.createElement("path", { d: `m -5 ${height} h 2 a 3 3 0 0 1 3 -2 l ${chevronIndent} -${height / 2 - 3} a 3 3 0 0 0 0 -2 l -${chevronIndent} -${height / 2 - 3} a 3 3 0 0 1 -3 -2 h -2 z`, fill: fillColor })),
        !isFirst ? (React.createElement("g", null,
            React.createElement("path", { d: `m 0 ${height} l ${chevronIndent} -${height / 2} l -${chevronIndent} -${height / 2} z`, fill: backgroundColor }))) : null));
}
//# sourceMappingURL=BreadcrumbSvg.js.map