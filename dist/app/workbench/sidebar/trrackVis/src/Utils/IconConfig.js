import React from 'react';
export function defaultIcon(color) {
    return {
        glyph: () => React.createElement("circle", { r: 5, fill: "white", stroke: color, strokeWidth: 2 }),
        currentGlyph: () => React.createElement("circle", { r: 5, fill: color, stroke: color, strokeWidth: 2 }),
        backboneGlyph: () => React.createElement("circle", { r: 5, fill: "white", stroke: color, strokeWidth: 2 }),
        bundleGlyph: () => React.createElement("circle", { r: 5, fill: "white", stroke: color, strokeWidth: 2 }),
        hoverGlyph: () => React.createElement("circle", { r: 6, fill: "white", stroke: color, strokeWidth: 2 }),
    };
}
//# sourceMappingURL=IconConfig.js.map