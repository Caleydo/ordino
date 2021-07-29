import React, { useState } from 'react';
import { Animate } from 'react-move';
import { Popup } from 'semantic-ui-react';
import translate from '../Utils/translate';
import { treeColor } from './Styles';
function BackboneNode({ prov, first, iconOnly, current, node, duration, radius, strokeWidth, textSize, nodeMap, annotationOpen, bookmark, setAnnotationOpen, exemptList, setExemptList, bundleMap, eventConfig, popupContent, editAnnotations, annotationContent, expandedClusterList, }) {
    var _a, _b;
    const padding = 15;
    const cursorStyle = {
        cursor: 'pointer',
    };
    const [annotateText, setAnnotateText] = useState(((_a = prov.getLatestAnnotation(node.id)) === null || _a === void 0 ? void 0 : _a.annotation) ? (_b = prov.getLatestAnnotation(node.id)) === null || _b === void 0 ? void 0 : _b.annotation
        : '');
    const handleCheck = () => {
        const lastAnnotation = prov.getLatestAnnotation(node.id);
        if ((lastAnnotation === null || lastAnnotation === void 0 ? void 0 : lastAnnotation.annotation) !== annotateText.trim()) {
            prov.addAnnotation(annotateText, node.id);
            setAnnotationOpen(-1);
        }
    };
    const handleClose = () => {
        var _a;
        setAnnotateText((_a = prov.getLatestAnnotation(node.id)) === null || _a === void 0 ? void 0 : _a.annotation);
        setAnnotationOpen(-1);
    };
    const handleInputChange = () => { };
    // console.log(JSON.parse(JSON.stringify(node)));
    let glyph = (React.createElement("circle", { style: cursorStyle, className: treeColor(current), r: radius, strokeWidth: strokeWidth }));
    // let backboneBundleNodes = findBackboneBundleNodes(nodeMap, bundleMap)
    let dropDownAdded = false;
    if (eventConfig) {
        const { eventType } = node.metadata;
        if (eventType && eventType in eventConfig && eventType !== 'Root') {
            const { bundleGlyph, currentGlyph, backboneGlyph } = eventConfig[eventType];
            if (bundleMap && Object.keys(bundleMap).includes(node.id)) {
                dropDownAdded = true;
                glyph = (React.createElement("g", { style: cursorStyle, fontWeight: 'none' }, bundleGlyph));
            }
            if (current) {
                glyph = (React.createElement("g", { style: cursorStyle, fontWeight: 'none' }, currentGlyph));
            }
            else if (!dropDownAdded) {
                glyph = (React.createElement("g", { style: cursorStyle, fontWeight: 'none' }, backboneGlyph));
            }
        }
    }
    let label = '';
    let annotate = '';
    // console.log(bundleMap)
    // console.log(nodeMap[node.id]);
    if (bundleMap &&
        Object.keys(bundleMap).includes(node.id) &&
        node.actionType === 'Ephemeral' &&
        expandedClusterList &&
        !expandedClusterList.includes(node.id)) {
        if (node.metadata && node.metadata.eventType) {
            label = `[${bundleMap[node.id].bunchedNodes.length}] ${node.metadata.eventType}`;
        }
        else {
            label = `[${bundleMap[node.id].bunchedNodes.length}]`;
        }
    }
    else {
        label = node.label;
    }
    if (node.artifacts &&
        node.artifacts.annotations.length > 0 &&
        annotationOpen !== nodeMap[node.id].depth) {
        annotate = node.artifacts.annotations[0].annotation;
    }
    if (!nodeMap[node.id]) {
        return null;
    }
    if (annotate.length > 20)
        annotate = `${annotate.substr(0, 20)}..`;
    if (label.length > 20)
        label = `${label.substr(0, 20)}..`;
    const labelG = (React.createElement("g", { style: { opacity: 1 }, transform: translate(padding, 0) }, !iconOnly ? (React.createElement("g", null,
        dropDownAdded ? (React.createElement("text", { style: cursorStyle, onClick: (e) => nodeClicked(node, e), fontSize: 17, fill: 'rgb(248, 191, 132)', textAnchor: "middle", alignmentBaseline: "middle", x: 1, y: 0, fontFamily: "Icons" }, expandedClusterList && expandedClusterList.includes(node.id)
            ? '\uf0d8'
            : '\uf0d7')) : (React.createElement("g", null)),
        editAnnotations ? (React.createElement("button", null,
            React.createElement("i", { className: "fas fa-undo marginRight" }),
            "Undo")) : (React.createElement("g", null)),
        React.createElement("text", { y: annotate.length === 0 ? 0 : -7, x: dropDownAdded ? 10 : 0, dominantBaseline: "middle", textAnchor: "start", fontSize: textSize, fontWeight: 'bold', onClick: () => labelClicked(node) }, label),
        ",",
        React.createElement("text", { y: 7, x: dropDownAdded ? 10 : 0, dominantBaseline: "middle", textAnchor: "start", fontSize: textSize, fontWeight: 'regular', onClick: () => labelClicked(node) }, annotate),
        ",",
        React.createElement("text", { style: cursorStyle, onClick: (e) => {
                prov.setBookmark(node.id, !prov.getBookmark(node.id));
                e.stopPropagation();
            }, fontSize: 17, className: "fas fa", opacity: bookmark === node.id || prov.getBookmark(node.id) ? 1 : 0, fill: prov.getBookmark(node.id) ? '#2185d0' : '#cccccc', textAnchor: "middle", alignmentBaseline: "middle", x: 175, y: 0, fontFamily: "Icons" }, '\uf02e'),
        ",",
        React.createElement("text", { style: cursorStyle, onClick: () => {
                if (annotationOpen === -1 ||
                    nodeMap[node.id].depth !== annotationOpen) {
                    setAnnotationOpen(nodeMap[node.id].depth);
                }
                else {
                    setAnnotationOpen(-1);
                }
            }, fontSize: 17, opacity: bookmark === node.id || annotationOpen === nodeMap[node.id].depth
                ? 1
                : 0, fill: annotationOpen === nodeMap[node.id].depth ? '#2185d0' : '#cccccc', textAnchor: "middle", alignmentBaseline: "middle", x: 210, y: 0, fontFamily: "Icons" }, '\uf044'))) : (React.createElement("g", null, dropDownAdded ? (React.createElement("text", { style: cursorStyle, onClick: (e) => nodeClicked(node, e), fontSize: 17, fill: 'rgb(248, 191, 132)', textAnchor: "middle", alignmentBaseline: "middle", x: 1, y: 0, fontFamily: "Icons" }, expandedClusterList && expandedClusterList.includes(node.id)
        ? '\uf0d8'
        : '\uf0d7')) : (React.createElement("g", null))))));
    return (React.createElement(Animate, { start: { opacity: 0 }, enter: {
            opacity: [1],
            timing: { duration: 100, delay: first ? 0 : duration },
        } }, () => (React.createElement(React.Fragment, null,
        popupContent !== undefined && nodeMap[node.id].depth > 0 ? (React.createElement(Popup, { content: popupContent(node), trigger: glyph })) : (glyph),
        popupContent !== undefined && nodeMap[node.id].depth > 0 ? (React.createElement(Popup, { content: popupContent(node), trigger: labelG })) : (labelG),
        annotationOpen !== -1 &&
            nodeMap[node.id].depth === annotationOpen ? (React.createElement("g", { transform: "translate(15, 25)" },
            React.createElement("foreignObject", { width: "175", height: "80", x: "0", y: "0" },
                React.createElement("div", null,
                    React.createElement("textarea", { style: { maxWidth: 130, resize: 'none' }, onChange: handleInputChange, value: annotateText }),
                    React.createElement("button", { onClick: handleCheck }, "Annotate"),
                    React.createElement("button", { onClick: handleClose }, "Close"))))) : (React.createElement("g", null))))));
    function labelClicked(innerNode) {
        if (annotationOpen === nodeMap[innerNode.id].depth && annotationContent) {
            setAnnotationOpen(-1);
        }
        else if (annotationContent) {
            setAnnotationOpen(nodeMap[innerNode.id].depth);
        }
    }
    function nodeClicked(innerNode, event) {
        if (bundleMap && Object.keys(bundleMap).includes(innerNode.id)) {
            const exemptCopy = Array.from(exemptList);
            if (exemptCopy.includes(innerNode.id)) {
                exemptCopy.splice(exemptCopy.findIndex((d) => d === innerNode.id), 1);
            }
            else {
                exemptCopy.push(innerNode.id);
            }
            setExemptList(exemptCopy);
        }
        event.stopPropagation();
    }
}
export default BackboneNode;
// const Label: FC<{ label: string } & React.SVGProps<SVGTextElement>> = (props: {
//   label: string;
// }) => {
//   return <text {...props}>{props.label}</text>;
// };
//# sourceMappingURL=BackboneNode.js.map