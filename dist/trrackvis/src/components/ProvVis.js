/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */
import { isChildNode, } from '@visdesignlab/trrack';
import { stratify, symbol, symbolCircle, symbolCross, symbolDiamond, symbolSquare, symbolStar, symbolTriangle, symbolWye, } from 'd3v5';
import React, { useEffect, useState } from 'react';
import { NodeGroup } from 'react-move';
import { Popup, Tab } from 'semantic-ui-react';
import { style } from 'typestyle';
import findBundleParent from '../Utils/findBundleParent';
import translate from '../Utils/translate';
import { treeLayout } from '../Utils/TreeLayout';
import BackboneNode from './BackboneNode';
import BookmarkListView from './BookmarkListView';
import bundleTransitions from './BundleTransitions';
import Link from './Link';
import linkTransitions from './LinkTransitions';
import nodeTransitions from './NodeTransitions';
import { treeColor } from './Styles';
import UndoRedoButton from './UndoRedoButton';
function ProvVis({ root, current, changeCurrent, width = 400, height = 800, iconOnly = false, gutter = 15, backboneGutter = 20, verticalSpace = 50, annotationHeight = 100, clusterVerticalSpace = 50, regularCircleRadius = 4, backboneCircleRadius = 5, regularCircleStroke = 3, backboneCircleStroke = 3, sideOffset = 200, topOffset = 30, textSize = 15, linkWidth = 4, duration = 600, clusterLabels = true, bundleMap = {}, eventConfig, popupContent, annotationContent, editAnnotations = false, prov, ephemeralUndo = false, }) {
    const [first, setFirst] = useState(true);
    const [bookmark, setBookmark] = useState(null);
    const [annotationOpen, setAnnotationOpen] = useState(-1);
    const [tabsValue, setValue] = useState(0);
    let nodeMap = prov.graph.nodes;
    let list = [];
    const eventTypes = new Set();
    for (const j in nodeMap) {
        const child = nodeMap[j];
        if (isChildNode(child)) {
            if (child.metadata.eventType) {
                eventTypes.add(child.metadata.eventType);
            }
            if (child.actionType === 'Ephemeral' &&
                child.children.length === 1 &&
                (nodeMap[child.parent].actionType !== 'Ephemeral' ||
                    nodeMap[child.parent].children.length > 1)) {
                const group = [];
                let curr = child;
                while (curr.actionType === 'Ephemeral') {
                    group.push(curr.id);
                    if (curr.children.length === 1 &&
                        nodeMap[curr.children[0]].actionType === 'Ephemeral') {
                        curr = nodeMap[curr.children[0]];
                    }
                    else {
                        break;
                    }
                }
                bundleMap[child.id] = {
                    metadata: '',
                    bundleLabel: '',
                    bunchedNodes: group,
                };
            }
        }
    }
    if (bundleMap) {
        list = list.concat(Object.keys(bundleMap));
    }
    function setDefaultConfig(types) {
        const symbols = [
            symbol().type(symbolStar).size(50),
            symbol().type(symbolDiamond),
            symbol().type(symbolTriangle),
            symbol().type(symbolCircle),
            symbol().type(symbolCross),
            symbol().type(symbolSquare),
            symbol().type(symbolWye),
        ];
        // Find nodes in the clusters whose entire cluster is on the backbone.
        const conf = {};
        let counter = 0;
        for (const j of types) {
            conf[j] = {};
            conf[j].backboneGlyph = (React.createElement("path", { strokeWidth: 2, className: treeColor(false), d: symbols[counter]() }));
            conf[j].bundleGlyph = (React.createElement("path", { strokeWidth: 2, className: treeColor(false), d: symbols[counter]() }));
            conf[j].currentGlyph = (React.createElement("path", { strokeWidth: 2, className: treeColor(true), d: symbols[counter]() }));
            conf[j].regularGlyph = (React.createElement("path", { strokeWidth: 2, className: treeColor(false), d: symbols[counter]() }));
            counter += 1;
        }
        return conf;
    }
    const [expandedClusterList, setExpandedClusterList] = useState(Object.keys(bundleMap));
    if (!eventConfig && eventTypes.size > 0 && eventTypes.size < 8) {
        eventConfig = setDefaultConfig(eventTypes);
    }
    useEffect(() => {
        setFirst(false);
    }, []);
    const nodeList = Object.values(nodeMap).filter(() => true);
    const copyList = Array.from(nodeList);
    const keys = bundleMap ? Object.keys(bundleMap) : [];
    // Find a list of all nodes included in a bundle.
    let bundledNodes = [];
    if (bundleMap) {
        for (const key of keys) {
            bundledNodes = bundledNodes.concat(bundleMap[key].bunchedNodes);
            bundledNodes.push(key);
        }
    }
    const strat = stratify()
        .id((d) => d.id)
        .parentId((d) => {
        if (d.id === root)
            return null;
        if (isChildNode(d)) {
            // If you are a unexpanded bundle, find your parent by going straight up.
            if (bundleMap &&
                Object.keys(bundleMap).includes(d.id) &&
                !expandedClusterList.includes(d.id)) {
                let curr = d;
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const localCurr = curr;
                    if (!bundledNodes.includes(localCurr.parent) ||
                        Object.keys(bundleMap).includes(localCurr.parent)) {
                        return localCurr.parent;
                    }
                    const temp = copyList.filter((c) => c.id === localCurr.parent)[0];
                    if (isChildNode(temp)) {
                        curr = temp;
                    }
                }
            }
            const bundleParents = findBundleParent(d.parent, bundleMap);
            let collapsedParent;
            let allExpanded = true;
            for (const j in bundleParents) {
                if (!expandedClusterList.includes(bundleParents[j])) {
                    allExpanded = false;
                    collapsedParent = bundleParents[j];
                    break;
                }
            }
            if (bundledNodes.includes(d.parent) &&
                bundleMap &&
                !Object.keys(bundleMap).includes(d.parent) &&
                !allExpanded) {
                return collapsedParent;
            }
            return d.parent;
        }
        return null;
    });
    for (let i = 0; i < nodeList.length; i++) {
        const bundleParents = findBundleParent(nodeList[i].id, bundleMap);
        let allExpanded = true;
        for (const j in bundleParents) {
            if (!expandedClusterList.includes(bundleParents[j])) {
                allExpanded = false;
                break;
            }
        }
        if (bundledNodes.includes(nodeList[i].id) &&
            !allExpanded &&
            bundleMap &&
            !Object.keys(bundleMap).includes(nodeList[i].id)) {
            nodeList.splice(i, 1);
            i--;
        }
    }
    const stratifiedTree = strat(nodeList);
    // //console.log(JSON.parse(JSON.stringify(stratifiedTree)));
    const stratifiedList = stratifiedTree.descendants();
    const stratifiedMap = {};
    stratifiedList.forEach((c) => {
        stratifiedMap[c.id] = c;
    });
    treeLayout(stratifiedMap, current, root);
    let maxHeight = 0;
    let maxWidth = 0;
    for (const j in stratifiedList) {
        if (stratifiedList[j].depth > maxHeight) {
            maxHeight = stratifiedList[j].depth;
        }
        if (stratifiedList[j].width > maxWidth) {
            maxWidth = stratifiedList[j].width;
        }
    }
    const links = stratifiedTree.links();
    const xOffset = gutter;
    const yOffset = verticalSpace;
    function regularGlyph(node) {
        if (eventConfig) {
            const { eventType } = node.metadata;
            if (eventType &&
                eventType in eventConfig &&
                eventType !== 'Root' &&
                eventConfig[eventType].regularGlyph) {
                return eventConfig[eventType].regularGlyph;
            }
        }
        return (React.createElement("circle", { r: regularCircleRadius, strokeWidth: regularCircleStroke, className: treeColor(false) }));
    }
    function bundleGlyph(node) {
        if (eventConfig) {
            const { eventType } = node.metadata;
            if (eventType && eventType in eventConfig && eventType !== 'Root') {
                return eventConfig[eventType].bundleGlyph;
            }
        }
        return (React.createElement("circle", { r: regularCircleRadius, strokeWidth: regularCircleStroke, className: treeColor(false) }));
    }
    let shiftLeft = 0;
    if (maxWidth === 0) {
        shiftLeft = 30;
    }
    else if (maxWidth === 1) {
        shiftLeft = 52;
    }
    else if (maxWidth > 1) {
        shiftLeft = 74;
    }
    const svgWidth = width;
    const overflowStyle = {
        overflowX: 'auto',
        overflowY: 'auto',
    };
    const tabsStyle = {
        backgroundColor: 'lightgrey',
        width: '270px',
    };
    const bookmarkTabView = (React.createElement("svg", { style: { overflow: 'visible' }, height: maxHeight < height ? height : maxHeight, width: svgWidth, id: "bookmarkView" },
        React.createElement("g", { id: 'globalG', transform: translate(shiftLeft, topOffset) },
            React.createElement(BookmarkListView, { graph: prov ? prov.graph : undefined, eventConfig: eventConfig, currentNode: current }))));
    const graphTabView = (React.createElement("div", null,
        React.createElement("div", { id: "undoRedoDiv" },
            React.createElement(UndoRedoButton, { graph: prov ? prov.graph : undefined, undoCallback: () => {
                    if (prov) {
                        if (ephemeralUndo) {
                            prov.goBackToNonEphemeral();
                        }
                        else {
                            prov.goBackOneStep();
                        }
                    }
                }, redoCallback: () => {
                    if (prov) {
                        if (ephemeralUndo) {
                            prov.goForwardToNonEphemeral();
                        }
                        else {
                            prov.goForwardOneStep();
                        }
                    }
                } })),
        React.createElement("svg", { style: { overflow: 'visible' }, id: 'topSvg', height: maxHeight < height ? height : maxHeight, width: svgWidth },
            React.createElement("rect", { height: height, width: width, fill: "none", stroke: "none" }),
            React.createElement("g", { id: 'globalG', transform: translate(shiftLeft, topOffset) },
                React.createElement(NodeGroup, Object.assign({ data: links, keyAccessor: (link) => `${link.source.id}${link.target.id}` }, linkTransitions(xOffset, yOffset, clusterVerticalSpace, backboneGutter - gutter, duration, annotationOpen, annotationHeight)), (linkArr) => (React.createElement(React.Fragment, null, linkArr.map((link) => {
                    const { key, state } = link;
                    return (React.createElement("g", { key: key },
                        React.createElement(Link, Object.assign({}, state, { fill: '#ccc', stroke: '#ccc', strokeWidth: linkWidth }))));
                })))),
                React.createElement(NodeGroup, Object.assign({ data: stratifiedList, keyAccessor: (d) => d.id }, nodeTransitions(xOffset, yOffset, clusterVerticalSpace, backboneGutter - gutter, duration, annotationOpen, annotationHeight)), (nodes) => (React.createElement(React.Fragment, null, nodes.map((node) => {
                    const { data: d, key, state } = node;
                    const popupTrigger = (React.createElement("g", { key: key, onClick: () => {
                            if (changeCurrent) {
                                changeCurrent(d.id);
                            }
                        }, onMouseOver: () => {
                            setBookmark(d.id);
                        }, onMouseOut: () => {
                            setBookmark(null);
                        }, transform: d.width === 0
                            ? translate(state.x, state.y)
                            : translate(state.x, state.y) }, d.width === 0 && prov ? (React.createElement("g", null,
                        React.createElement("rect", { width: "200", height: "25", transform: "translate(0, -12.5)", opacity: "0" }),
                        ",",
                        React.createElement(BackboneNode, { prov: prov, textSize: textSize, iconOnly: iconOnly, radius: backboneCircleRadius, strokeWidth: backboneCircleStroke, duration: duration, first: first, current: prov.current.id === d.id, node: d.data, setBookmark: setBookmark, bookmark: bookmark, bundleMap: bundleMap, nodeMap: stratifiedMap, clusterLabels: clusterLabels, annotationOpen: annotationOpen, setAnnotationOpen: setAnnotationOpen, exemptList: expandedClusterList, editAnnotations: editAnnotations, setExemptList: setExpandedClusterList, eventConfig: eventConfig, annotationContent: annotationContent, popupContent: popupContent, expandedClusterList: expandedClusterList }))) : popupContent !== undefined ? (React.createElement(Popup, { content: popupContent(d.data), trigger: React.createElement("g", { onClick: () => {
                                setAnnotationOpen(-1);
                            } }, keys.includes(d.id)
                            ? bundleGlyph(d.data)
                            : regularGlyph(d.data)) })) : (React.createElement("g", { onClick: () => {
                            setAnnotationOpen(-1);
                        } }, regularGlyph(d.data)))));
                    return popupTrigger;
                })))),
                React.createElement(NodeGroup, Object.assign({ data: keys, keyAccessor: (key) => `${key}` }, bundleTransitions(xOffset, verticalSpace, clusterVerticalSpace, backboneGutter - gutter, duration, expandedClusterList, stratifiedMap, stratifiedList, annotationOpen, annotationHeight, bundleMap)), (bundle) => (React.createElement(React.Fragment, null, bundle.map((b) => {
                    const { key, state } = b;
                    if (bundleMap === undefined ||
                        stratifiedMap[b.key].width !== 0 ||
                        state.validity === false) {
                        return null;
                    }
                    return (React.createElement("g", { key: key, transform: translate(state.x - gutter + 5, state.y - clusterVerticalSpace / 2) },
                        React.createElement("rect", { style: { opacity: state.opacity }, width: iconOnly ? 42 : sideOffset - 15, height: state.height, rx: "10", ry: "10", fill: "none", strokeWidth: "2px", stroke: "rgb(248, 191, 132)" })));
                }))))))));
    const panes = [
        {
            menuItem: { key: 'Graph', icon: 'share alternate', content: 'Graph' },
            render: () => React.createElement(Tab.Pane, { attached: false }, graphTabView),
        },
        {
            menuItem: {
                key: 'Bookmarks/Annotations',
                icon: 'bookmark',
                content: 'Bookmarks/Annotations',
            },
            render: () => React.createElement(Tab.Pane, { attached: false }, bookmarkTabView),
        },
    ];
    return (React.createElement("div", { style: overflowStyle, className: container, id: "prov-vis" },
        React.createElement(Tab, { menu: { secondary: true, pointing: true }, panes: panes })));
}
export default ProvVis;
const container = style({
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
});
//# sourceMappingURL=ProvVis.js.map