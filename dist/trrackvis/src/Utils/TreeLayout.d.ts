import { ProvenanceNode } from '@visdesignlab/trrack';
import { HierarchyNode } from 'd3v5';
import { StratifiedMap } from '../components/ProvVis';
export declare type TreeNode = HierarchyNode<unknown>;
export interface ExtendedHierarchyNode<T, S, A> extends HierarchyNode<ProvenanceNode<S, A>> {
    column: number;
}
export declare type ExtendedStratifiedMap<T, S, A> = {
    [key: string]: ExtendedHierarchyNode<T, S, A>;
};
export declare function treeLayout<T, S, A>(nodes: StratifiedMap<T, S, A>, current: string, root: string): string[];
export declare function getPathTo<T, S, A>(nodes: StratifiedMap<T, S, A>, from: string, to: string): string[];
