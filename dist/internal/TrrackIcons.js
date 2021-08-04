import React from "react";
function translate(x, y) {
    return `translate(${x}, ${y})`;
}
function CreateView({ size = 15, fill = "#ccc", }) {
    return (React.createElement("g", null,
        React.createElement("circle", { fill: "white", r: size - size / 4 }),
        React.createElement("g", { transform: translate(-size / 2, -size / 2) },
            React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", width: size, height: size, viewBox: "0 0 120.522 138.944" },
                React.createElement("polygon", { stroke: "black", fill: fill, points: "63.166,138.946 120.33,105.942 63.166,72.937 \t" }),
                React.createElement("polygon", { stroke: "black", fill: fill, points: "59.164,72.937 2,105.942 59.164,138.944 \t" }),
                React.createElement("polygon", { stroke: "black", fill: fill, points: "57.164,69.472 0,36.468 0,102.478 \t" }),
                React.createElement("polygon", { stroke: "black", fill: fill, points: "59.164,0 2,33.003 59.164,66.007 \t" }),
                React.createElement("polygon", { stroke: "black", fill: fill, points: "63.166,66.008 120.33,33.004 63.166,0 \t" })))));
}
export const eventConfig = {
    "Create View": {
        backboneGlyph: React.createElement(CreateView, { size: 22 }),
        currentGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
        regularGlyph: React.createElement(CreateView, { size: 16 }),
        bundleGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
    },
    "Remove View": {
        backboneGlyph: React.createElement(CreateView, { size: 22 }),
        currentGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
        regularGlyph: React.createElement(CreateView, { size: 16 }),
        bundleGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
    },
    "Change View": {
        backboneGlyph: React.createElement(CreateView, { size: 22 }),
        currentGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
        regularGlyph: React.createElement(CreateView, { size: 16 }),
        bundleGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
    },
    "Change Focus View": {
        backboneGlyph: React.createElement(CreateView, { size: 22 }),
        currentGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
        regularGlyph: React.createElement(CreateView, { size: 16 }),
        bundleGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
    },
    "Select Focus": {
        backboneGlyph: React.createElement(CreateView, { size: 22 }),
        currentGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
        regularGlyph: React.createElement(CreateView, { size: 16 }),
        bundleGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
    },
    "Replace View": {
        backboneGlyph: React.createElement(CreateView, { size: 22 }),
        currentGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
        regularGlyph: React.createElement(CreateView, { size: 16 }),
        bundleGlyph: React.createElement(CreateView, { fill: "#2185d0", size: 22 }),
    },
};
//# sourceMappingURL=TrrackIcons.js.map