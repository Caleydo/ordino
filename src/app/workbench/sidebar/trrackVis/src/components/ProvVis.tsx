/* eslint-disable import/no-cycle */
import { BaseArtifactType, NodeId, Nodes, ProvenanceNode } from '@trrack/core';
import React, { ReactChild, useMemo } from 'react';
import { BundleMap } from '../Utils/BundleMap';
import { IconConfig } from '../Utils/IconConfig';
import { Tree } from './Tree';
import { useComputeNodePosition } from './useComputeNodePosition';

interface ProvVisProps<T, S extends string, A extends BaseArtifactType<any>> {
  root: NodeId;
  currentNode: NodeId;
  nodeMap: Nodes<T, S, A>;
  config?: Partial<ProvVisConfig<T, S, A>>;
}

export interface ProvVisConfig<T, S extends string, A extends BaseArtifactType<any>> {
  gutter: number;
  verticalSpace: number;
  marginTop: number;
  marginLeft: number;
  animationDuration: number;
  annotationHeight: number;
  nodeAndLabelGap: number;
  labelWidth: number;
  iconConfig: IconConfig<T, S, A> | null;
  changeCurrent: (id: NodeId) => void;
  bookmarkNode: (id: NodeId) => void;
  annotateNode: (id: NodeId, annotation: string) => void;
  getAnnotation: (id: NodeId) => string;
  isBookmarked: (id: NodeId) => boolean;
}

const defaultConfig: ProvVisConfig<any, any, any> = {
  gutter: 25,
  verticalSpace: 50,
  marginTop: 50,
  marginLeft: 50,
  animationDuration: 500,
  annotationHeight: 150,
  nodeAndLabelGap: 20,
  labelWidth: 150,
  iconConfig: null,
  changeCurrent: () => null,
  bookmarkNode: () => null,
  annotateNode: () => null,
  getAnnotation: (id: NodeId) => '',
  isBookmarked: (id: NodeId) => false,
};

export function ProvVis<T, S extends string, A extends BaseArtifactType<any>>({ nodeMap, root, currentNode, config }: ProvVisProps<T, S, A>) {
  const { stratifiedMap: nodePositions, links } = useComputeNodePosition(nodeMap, currentNode, root);

  console.log(currentNode);

  const mergedConfig = useMemo(() => {
    return { ...defaultConfig, ...config };
  }, [config]);

  return <Tree nodes={nodePositions} links={links} config={mergedConfig} currentNode={currentNode} />;
}
