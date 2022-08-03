import { BaseArtifactType, NodeId, ProvenanceNode } from '@trrack/core';
import { ProvVisConfig } from './ProvVis';
export declare function NodeDescription<T, S extends string, A extends BaseArtifactType<any>>({ depth, yOffset, node, config, currentNode, onClick, isHover, setHover, colorMap, annotationDepth, setAnnotationDepth, }: {
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
}): JSX.Element;
//# sourceMappingURL=NodeDescription.d.ts.map