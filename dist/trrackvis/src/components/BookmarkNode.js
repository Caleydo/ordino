import React from 'react';
import { Animate } from 'react-move';
import { treeColor } from './Styles';
function BookmarkNode({ current, node, eventConfig, }) {
    const radius = 5;
    const strokeWidth = 2;
    const textSize = 15;
    const cursorStyle = {
        cursor: 'pointer',
    };
    let glyph = (React.createElement("circle", { style: cursorStyle, className: treeColor(current), r: radius, strokeWidth: strokeWidth }));
    const dropDownAdded = false;
    const { eventType } = node.metadata;
    if (eventConfig) {
        const { currentGlyph, backboneGlyph } = eventConfig[eventType];
        if (current) {
            glyph = (React.createElement("g", { style: cursorStyle, fontWeight: 'none' }, currentGlyph));
        }
        else {
            glyph = (React.createElement("g", { style: cursorStyle, fontWeight: 'none' }, backboneGlyph));
        }
    }
    let label = '';
    let annotate = '';
    if (node.artifacts &&
        node.artifacts.annotations.length > 0 &&
        node.artifacts.annotations[0].annotation.length > 0) {
        annotate = node.artifacts.annotations[0].annotation;
    }
    label = node.label;
    if (annotate.length > 20)
        annotate = `${annotate.substr(0, 20)}..`;
    if (label.length > 20)
        label = `${label.substr(0, 20)}..`;
    return (React.createElement(Animate, { start: { opacity: 0 }, enter: {
            opacity: [1],
        } }, () => (React.createElement(React.Fragment, null,
        React.createElement("g", { style: { opacity: 1 } },
            glyph,
            React.createElement("text", { y: 0, x: 20, dominantBaseline: "middle", textAnchor: "start", fontSize: textSize, fontWeight: 'bold' }, label),
            React.createElement("text", { y: 20, x: dropDownAdded ? 10 : 0, dominantBaseline: "middle", textAnchor: "start", fontSize: textSize, fontWeight: 'regular' }, annotate))))));
}
export default BookmarkNode;
//# sourceMappingURL=BookmarkNode.js.map