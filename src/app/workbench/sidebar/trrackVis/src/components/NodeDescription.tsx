/* eslint-disable import/no-cycle */
import { BaseArtifactType, isStateNode, NodeId, ProvenanceNode } from '@trrack/core';
import React from 'react';
import { useSpring, animated, easings } from 'react-spring';
import { AnnotationButton } from './AnnotationButton';
import { BookmarkButton } from './BookmarkButton';
import { ProvVisConfig } from './ProvVis';
import { AnnotationField } from './AnnotationField';

export function NodeDescription<T, S extends string, A extends BaseArtifactType<any>>({
  depth,
  yOffset,
  node,
  config,
  currentNode,
  onClick,
  isHover,
  setHover,
  colorMap,
  annotationDepth,
  setAnnotationDepth,
}: {
  depth: number;
  yOffset: number;
  node: ProvenanceNode<T, S, A>;
  config: ProvVisConfig<T, S, A>;
  currentNode: NodeId;
  onClick: () => void;
  isHover: boolean;
  setHover: (node: NodeId | null) => void;
  colorMap: Record<S | 'Root', string>;
  annotationDepth: number | null;
  setAnnotationDepth: (depth: number | null) => void;
}) {
  const style = useSpring({
    config: {
      duration: config.animationDuration,
      easing: easings.easeInOutSine,
    },
    top: depth * config.verticalSpace + config.marginTop / 2 + yOffset,
  });

  return (
    <>
      <animated.div
        style={{
          ...style,
          cursor: 'pointer',
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          height: config.verticalSpace,
          justifyContent: 'center',
          alignItems: 'end',
          width: `${config.labelWidth}px`,
        }}
        onClick={onClick}
        onMouseEnter={() => setHover(node.id)}
        onMouseLeave={() => setHover(null)}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isHover || annotationDepth === depth ? (
            <AnnotationButton color="cornflowerblue" isAnnotating={annotationDepth === depth} onClick={() => setAnnotationDepth(depth)} />
          ) : null}
          {isHover || config.isBookmarked(node.id) ? (
            <BookmarkButton color={colorMap[node.meta.eventType]} isBookmarked={config.isBookmarked(node.id)} onClick={() => config.bookmarkNode(node.id)} />
          ) : null}
          <div
            style={{
              // width: `${config.labelWidth}px`,
              alignItems: 'end',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <p
              style={{
                maxWidth: `${config.labelWidth}px`,
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {node.label}
            </p>
            {isStateNode(node) ? (
              <p
                style={{
                  maxWidth: `${config.labelWidth}px`,
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'gray',
                }}
              >
                {config.getAnnotation(node.id)}
              </p>
            ) : null}
          </div>
        </div>
      </animated.div>
      {annotationDepth === depth ? (
        <animated.div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'start',
            fontSize: '12px !important',
            width: `250px`,
            zIndex: 10,
            top: style.top.to((num) => num + config.verticalSpace),
          }}
        >
          <AnnotationField config={config} node={node} setAnnotationDepth={setAnnotationDepth} />
        </animated.div>
      ) : null}
    </>
  );
}
