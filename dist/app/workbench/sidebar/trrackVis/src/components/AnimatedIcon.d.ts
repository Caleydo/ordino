import { BaseArtifactType, NodeId, ProvenanceNode } from '@trrack/core';
import { ProvVisConfig } from './ProvVis';
export declare function AnimatedIcon<T, S extends string, A extends BaseArtifactType<any>>({ width, depth, yOffset, onClick, config, node, currentNode, isHover, setHover, colorMap, }: {
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
}): JSX.Element;
//# sourceMappingURL=AnimatedIcon.d.ts.map