import { BaseArtifactType, ProvenanceNode } from '@trrack/core';
import { HierarchyNode } from 'd3v7';
import { StratifiedMap } from '../components/useComputeNodePosition';
export declare type TreeNode = HierarchyNode<unknown>;
export interface ExtendedHierarchyNode<T, S extends string, A extends BaseArtifactType<any>> extends HierarchyNode<ProvenanceNode<T, S, A>> {
    column: number;
}
export declare type ExtendedStratifiedMap<T, S extends string, A extends BaseArtifactType<any>> = {
    [key: string]: ExtendedHierarchyNode<T, S, A>;
};
export declare function getPathTo<T, S extends string, A extends BaseArtifactType<any>>(nodes: StratifiedMap<T, S, A>, from: string, to: string): string[];
export declare function treeLayout<T, S extends string, A extends BaseArtifactType<any>>(nodes: StratifiedMap<T, S, A>, current: string, root: string): string[];
//# sourceMappingURL=TreeLayout.d.ts.map