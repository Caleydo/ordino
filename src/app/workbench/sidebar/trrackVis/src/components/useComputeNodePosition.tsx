import { Nodes, ProvenanceNode, NodeId, isStateNode, BaseArtifactType } from '@trrack/core';
import { HierarchyNode, stratify } from 'd3v7';
import { useMemo } from 'react';
// eslint-disable-next-line import/no-cycle
import { treeLayout } from '../Utils/TreeLayout';

export type StratifiedList<T, S extends string, A extends BaseArtifactType<any>> = HierarchyNode<ProvenanceNode<T, S, A>>[];

export type StratifiedMap<T, S extends string, A extends BaseArtifactType<any>> = {
  [key: string]: HierarchyNode<ProvenanceNode<T, S, A>> & { width?: number };
};

export function useComputeNodePosition<T, S extends string, A extends BaseArtifactType<any>>(nodeMap: Nodes<T, S, A>, current: NodeId, root: NodeId) {
  const { stratifiedMap, links } = useMemo(() => {
    const nodeList = Object.values(nodeMap);

    const strat = stratify<ProvenanceNode<T, S, A>>()
      .id((d) => d.id)
      .parentId((d) => {
        if (d.id === root) return null;

        if (isStateNode(d)) {
          return d.parent;
        }
        return null;
      });

    const stratifiedTree = strat(nodeList);

    const stratifiedList: StratifiedList<T, S, A> = stratifiedTree.descendants();
    const innerMap: StratifiedMap<T, S, A> = {};

    stratifiedList.forEach((c) => {
      innerMap[c.id] = c;
    });

    treeLayout(innerMap, current, root);
    return { stratifiedMap: innerMap, links: stratifiedTree.links() };
  }, [current, root, nodeMap]);

  return { stratifiedMap, links };
}
