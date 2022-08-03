import { Nodes, ProvenanceNode, NodeId, BaseArtifactType } from '@trrack/core';
import { HierarchyNode } from 'd3v7';
export declare type StratifiedList<T, S extends string, A extends BaseArtifactType<any>> = HierarchyNode<ProvenanceNode<T, S, A>>[];
export declare type StratifiedMap<T, S extends string, A extends BaseArtifactType<any>> = {
    [key: string]: HierarchyNode<ProvenanceNode<T, S, A>> & {
        width?: number;
    };
};
export declare function useComputeNodePosition<T, S extends string, A extends BaseArtifactType<any>>(nodeMap: Nodes<T, S, A>, current: NodeId, root: NodeId): {
    stratifiedMap: StratifiedMap<T, S, A>;
    links: import("d3-hierarchy").HierarchyLink<ProvenanceNode<T, S, A>>[];
};
//# sourceMappingURL=useComputeNodePosition.d.ts.map