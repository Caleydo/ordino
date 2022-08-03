/* eslint-disable import/no-cycle */
import { BaseArtifactType, NodeId, ProvenanceNode } from '@trrack/core';
import React, { useState, useMemo } from 'react';
import { useSpring, animated, easings } from 'react-spring';
import { defaultIcon } from '../Utils/IconConfig';
import { ProvVisConfig } from './ProvVis';

export function AnimatedIcon<T, S extends string, A extends BaseArtifactType<any>>({
  width,
  depth,
  yOffset,
  onClick,
  config,
  node,
  currentNode,
  isHover,
  setHover,
  colorMap,
}: {
  width: number;
  depth: number;
  yOffset: number;
  onClick: () => void;
  config: ProvVisConfig<T, S, A>;
  node: ProvenanceNode<T, S, A>;
  currentNode: NodeId;
  isHover: boolean;
  setHover: (node: NodeId | null) => void;
  colorMap: Record<S | 'Root', string>;
}) {
  const style = useSpring({
    config: {
      duration: config.animationDuration,
      easing: easings.easeInOutSine,
    },
    transform: `translate(${width * config.gutter}, ${depth * config.verticalSpace + yOffset})`,
  });

  const icon = useMemo(() => {
    const currentIconConfig = config.iconConfig?.[node.meta.eventType];
    const currDefaultIcon = defaultIcon(colorMap[node.meta.eventType]);

    if (currentIconConfig && currentIconConfig.glyph) {
      if (node.id === currentNode && currentIconConfig.currentGlyph) {
        return currentIconConfig.currentGlyph(node);
      }
      if (isHover && currentIconConfig.hoverGlyph) {
        return currentIconConfig.hoverGlyph(node);
      }
      if (width === 0 && currentIconConfig.backboneGlyph) {
        return currentIconConfig.backboneGlyph(node);
      }

      return currentIconConfig.glyph(node);
    }
    if (node.id === currentNode) {
      return currDefaultIcon.currentGlyph(node);
    }
    if (isHover) {
      return currDefaultIcon.hoverGlyph(node);
    }
    if (width === 0) {
      return currDefaultIcon.backboneGlyph(node);
    }

    return currDefaultIcon.glyph(node);
  }, [config.iconConfig, currentNode, isHover, width, colorMap, node]);

  return (
    <animated.g
      {...style}
      cursor="pointer"
      onClick={onClick}
      onMouseOver={() => {
        if (!style.transform.isAnimating) {
          setHover(node.id);
        }
      }}
      onMouseOut={() => setHover(null)}
    >
      {icon}
    </animated.g>
  );
}
