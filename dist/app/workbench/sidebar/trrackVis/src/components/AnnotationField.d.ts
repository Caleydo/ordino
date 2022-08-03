import { BaseArtifactType, ProvenanceNode } from '@trrack/core';
import { ProvVisConfig } from './ProvVis';
export declare function AnnotationField<T, S extends string, A extends BaseArtifactType<any>>({ config, node, setAnnotationDepth, }: {
    config: ProvVisConfig<T, S, A>;
    node: ProvenanceNode<T, S, A>;
    setAnnotationDepth: (depth: number | null) => void;
}): JSX.Element;
//# sourceMappingURL=AnnotationField.d.ts.map