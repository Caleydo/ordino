import React, { useMemo, useState } from 'react';
import { AnimatedIcon } from './AnimatedIcon';
import { AnimatedLine } from './AnimatedLine';
import { NodeDescription } from './NodeDescription';
import { IconLegend } from './IconLegend';
export function Tree({ nodes, links, currentNode, config, }) {
    const [hoverNode, setHoverNode] = useState(null);
    const [annotationDepth, setAnnotationDepth] = useState(null);
    // give each event type a color to use for the default icons
    // colors are the default tableau 10 colors
    const colorMap = useMemo(() => {
        const tableauColors = ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#CFECF9', '#7F7F7F', '#BCBD22', '#17BECF'];
        let currColorNumber = 0;
        const innerColorMap = {};
        innerColorMap.Root = 'black';
        Object.values(nodes).forEach((node) => {
            if (!innerColorMap[node.data.meta.eventType]) {
                innerColorMap[node.data.meta.eventType] = tableauColors[currColorNumber % 10];
                currColorNumber += 1;
            }
        });
        return innerColorMap;
    }, [nodes]);
    // render the descriptions for the backbone nodes
    const descriptions = useMemo(() => {
        return Object.values(nodes)
            .filter((node) => node.width === 0)
            .map((node) => {
            return (React.createElement(NodeDescription, { key: node.id, config: config, depth: node.depth, node: node.data, currentNode: currentNode, onClick: () => config.changeCurrent(node.id), isHover: node.id === hoverNode, setHover: (currNode) => setHoverNode(currNode), colorMap: colorMap, setAnnotationDepth: (depth) => {
                    if (annotationDepth !== depth) {
                        setAnnotationDepth(depth);
                    }
                    else {
                        setAnnotationDepth(null);
                    }
                }, annotationDepth: annotationDepth, yOffset: 0 }));
        });
    }, [nodes, currentNode, hoverNode, annotationDepth, colorMap, config]);
    // render edges for every node
    const edges = useMemo(() => {
        return links.map((link) => {
            // TODO:: idk how to fix this typing
            const sourceWidth = link.source.width;
            const targetWidth = link.target.width;
            return (React.createElement(AnimatedLine, { key: link.source.id + link.target.id, x1Width: sourceWidth, x2Width: targetWidth, y1Depth: link.source.depth, y2Depth: link.target.depth, config: config, y1Offset: 0, y2Offset: 0 }));
        });
    }, [links, config]);
    // render icons for every node
    const nodeIcons = useMemo(() => {
        return Object.values(nodes).map((node) => {
            return (React.createElement(AnimatedIcon, { key: node.id, width: node.width, depth: node.depth, onClick: () => {
                    // this if is just to avoid some annoying hovers that would flash quickly when you switched nodes
                    if (node.width !== 0) {
                        setHoverNode(null);
                    }
                    config.changeCurrent(node.id);
                }, config: config, node: node.data, currentNode: currentNode, isHover: node.id === hoverNode, setHover: (currNode) => setHoverNode(currNode), colorMap: colorMap, yOffset: 0 }));
        });
    }, [nodes, currentNode, config, hoverNode, colorMap]);
    return (React.createElement("div", { style: {
            display: 'flex',
            height: '100%',
            gap: `${config.labelWidth}px`,
        } },
        React.createElement("div", { style: {
                position: 'relative',
            } }, descriptions),
        React.createElement("svg", { style: { overflow: 'inherit' } },
            React.createElement("g", { transform: `translate(${config.nodeAndLabelGap}, ${config.marginTop})` },
                edges,
                nodeIcons)),
        React.createElement(IconLegend, { colorMap: colorMap, nodes: nodes, config: config })));
}
//# sourceMappingURL=Tree.js.map