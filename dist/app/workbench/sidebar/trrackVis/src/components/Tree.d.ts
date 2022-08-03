import { BaseArtifactType, NodeId, ProvenanceNode } from '@trrack/core';
import { HierarchyLink } from 'd3v7';
import { ProvVisConfig } from './ProvVis';
import { StratifiedMap } from './useComputeNodePosition';
export declare function Tree<T, S extends string, A extends BaseArtifactType<any>>({ nodes, links, currentNode, config, }: {
    nodes: StratifiedMap<T, S, A>;
    links: HierarchyLink<ProvenanceNode<T, S, A>>[];
    config: ProvVisConfig<T, S, A>;
    currentNode: NodeId;
}): JSX.Element;
//# sourceMappingURL=Tree.d.ts.map