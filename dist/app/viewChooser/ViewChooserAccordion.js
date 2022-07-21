import { groupBy } from 'lodash';
import { UniqueIdManager } from 'tdp_core';
import React from 'react';
import { isVisynRankingViewDesc } from '../../views';
import { BreadcrumbSvgPathOnly } from '../../components/breadcrumb/BreadcrumbSvgPathOnly';
/**
 * Using this function to convert to HSL so that we can lighten our colors easily.
 * Taken from https://www.jameslmilner.com/posts/converting-rgb-hex-hsl-colors/#hex-to-hsl
 */
function HexToHSL(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        throw new Error('Could not parse Hex Color');
    }
    const rHex = parseInt(result[1], 16);
    const gHex = parseInt(result[2], 16);
    const bHex = parseInt(result[3], 16);
    const r = rHex / 255;
    const g = gHex / 255;
    const b = bHex / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = (max + min) / 2;
    let s = h;
    let l = h;
    if (max === min) {
        // Achromatic
        return { h: 0, s: 0, l };
    }
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / d + 2;
            break;
        case b:
            h = (r - g) / d + 4;
            break;
        default:
            break;
    }
    h /= 6;
    s *= 100;
    s = Math.round(s);
    l *= 100;
    l = Math.round(l);
    h = Math.round(360 * h);
    return { h, s, l };
}
export function ViewChooserAccordion(props) {
    const uniqueSuffix = UniqueIdManager.getInstance().uniqueId();
    const groups = groupBy(props.views, (view) => view.group.name);
    return (React.createElement("div", { className: "view-buttons flex-grow-1 flex-row border-top border-light overflow-auto" }, Object.keys(groups)
        .sort((a, b) => groups[a][0].group.order - groups[b][0].group.order)
        .map((v, i) => (
    // eslint-disable-next-line react/no-array-index-key
    React.createElement("div", { className: `accordion-item border-0 ${i < Object.keys(groups).length - 1 ? 'border-bottom border-light' : ''}`, key: i },
        React.createElement("button", { className: `accordion-button btn-text-gray py-2 shadow-none text-nowrap ${groups[v].some((g) => { var _a; return g.id === ((_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.id); }) ? 'active' : ''}`, type: "button", style: { fontWeight: 500, color: 'black' }, "data-bs-toggle": "collapse", "data-bs-target": `#collapse-${i}-${uniqueSuffix}`, "aria-expanded": "true", "aria-controls": `collapse-${i}-${uniqueSuffix}` }, v),
        React.createElement("div", { id: `collapse-${i}-${uniqueSuffix}`, className: "collapse show", "aria-labelledby": v },
            React.createElement("div", { className: "d-grid gap-2 px-0 py-1" }, groups[v].map((view, idx) => {
                var _a;
                return (React.createElement("button", { type: "button", className: `d-flex view-chooser-button align-items-center btn-text-gray justify-content-between btn py-1 ps-4 pe-0 text-start shadow-none text-nowrap rounded-0 ${view.id === ((_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.id) ? 'active' : ''}`, style: {
                        color: 'black',
                        '--custom_color-h': HexToHSL(view.color).h,
                        '--custom_color-s': `${HexToHSL(view.color).s}%`,
                        '--custom_color-l': `${HexToHSL(view.color).l}%`,
                    }, 
                    // eslint-disable-next-line react/no-array-index-key
                    key: idx, onClick: () => props.onSelectedView(view) },
                    React.createElement("div", null, view.name),
                    isVisynRankingViewDesc(view) ? (React.createElement("div", { className: "d-flex h-100 align-items-center", style: { marginRight: '1.25rem', width: `1rem` } },
                        React.createElement(BreadcrumbSvgPathOnly, { color: view.color }))) : view.icon ? (React.createElement("i", { className: `${view.icon}`, style: { marginRight: '1.25rem', fontSize: '16px', color: view.color } })) : null));
            }))))))));
}
//# sourceMappingURL=ViewChooserAccordion.js.map