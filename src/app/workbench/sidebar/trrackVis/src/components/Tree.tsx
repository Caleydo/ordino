/* eslint-disable import/no-cycle */
import { BaseArtifactType, NodeId, ProvenanceNode } from '@trrack/core';
import React, { useMemo, useState } from 'react';
import { HierarchyLink, HierarchyNode } from 'd3v7';
import { AnimatedIcon } from './AnimatedIcon';
import { AnimatedLine } from './AnimatedLine';
import { ProvVisConfig } from './ProvVis';
import { NodeDescription } from './NodeDescription';
import { StratifiedMap } from './useComputeNodePosition';
import { IconLegend } from './IconLegend';

export function Tree<T, S extends string, A extends BaseArtifactType<any>>({
  nodes,
  links,
  currentNode,
  config,
}: {
  nodes: StratifiedMap<T, S, A>;
  links: HierarchyLink<ProvenanceNode<T, S, A>>[];
  config: ProvVisConfig<T, S, A>;
  currentNode: NodeId;
}) {
  const [hoverNode, setHoverNode] = useState<NodeId | null>(null);
  const [annotationDepth, setAnnotationDepth] = useState<number | null>(null);

  // give each event type a color to use for the default icons
  // colors are the default tableau 10 colors
  const colorMap = useMemo(() => {
    const tableauColors = ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#CFECF9', '#7F7F7F', '#BCBD22', '#17BECF'];

    let currColorNumber = 0;

    const innerColorMap: Record<S | 'Root', string> = {} as Record<S | 'Root', string>;

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
        return (
          <NodeDescription
            key={node.id}
            config={config}
            depth={node.depth}
            node={node.data}
            currentNode={currentNode}
            onClick={() => config.changeCurrent(node.id)}
            isHover={node.id === hoverNode}
            setHover={(currNode: NodeId | null) => setHoverNode(currNode)}
            colorMap={colorMap}
            setAnnotationDepth={(depth: number | null) => {
              if (annotationDepth !== depth) {
                setAnnotationDepth(depth);
              } else {
                setAnnotationDepth(null);
              }
            }}
            annotationDepth={annotationDepth}
            yOffset={0}
          />
        );
      });
  }, [nodes, currentNode, hoverNode, annotationDepth, colorMap, config]);

  // render edges for every node
  const edges = useMemo(() => {
    return links.map((link) => {
      // TODO:: idk how to fix this typing
      const sourceWidth = (
        link.source as HierarchyNode<ProvenanceNode<T, S, A>> & {
          width: number;
        }
      ).width;

      const targetWidth = (
        link.target as HierarchyNode<ProvenanceNode<T, S, A>> & {
          width: number;
        }
      ).width;

      return (
        <AnimatedLine
          key={link.source.id + link.target.id}
          x1Width={sourceWidth}
          x2Width={targetWidth}
          y1Depth={link.source.depth}
          y2Depth={link.target.depth}
          config={config}
          y1Offset={0}
          y2Offset={0}
        />
      );
    });
  }, [links, config]);

  // render icons for every node
  const nodeIcons = useMemo(() => {
    return Object.values(nodes).map((node) => {
      return (
        <AnimatedIcon
          key={node.id}
          width={node.width}
          depth={node.depth}
          onClick={() => {
            // this if is just to avoid some annoying hovers that would flash quickly when you switched nodes
            if (node.width !== 0) {
              setHoverNode(null);
            }
            config.changeCurrent(node.id);
          }}
          config={config}
          node={node.data}
          currentNode={currentNode}
          isHover={node.id === hoverNode}
          setHover={(currNode: NodeId | null) => setHoverNode(currNode)}
          colorMap={colorMap}
          yOffset={0}
        />
      );
    });
  }, [nodes, currentNode, config, hoverNode, colorMap]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        gap: `${config.labelWidth}px`,
      }}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        {descriptions}
      </div>
      <svg style={{ overflow: 'inherit' }}>
        <g transform={`translate(${config.nodeAndLabelGap}, ${config.marginTop})`}>
          {edges}
          {nodeIcons}
        </g>
      </svg>
      <IconLegend colorMap={colorMap} nodes={nodes} config={config} />
    </div>
  );
}
