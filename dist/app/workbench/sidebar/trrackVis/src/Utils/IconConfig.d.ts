import { BaseArtifactType, ProvenanceNode } from '@trrack/core';
import { ReactChild } from 'react';
export interface Config<T, S extends string, A extends BaseArtifactType<any>> {
    glyph: (node?: ProvenanceNode<T, S, A>) => ReactChild;
    currentGlyph: (node?: ProvenanceNode<T, S, A>) => ReactChild;
    backboneGlyph: (node?: ProvenanceNode<T, S, A>) => ReactChild;
    bundleGlyph: (node?: ProvenanceNode<T, S, A>) => ReactChild;
    hoverGlyph: (node?: ProvenanceNode<T, S, A>) => ReactChild;
}
export declare type IconConfig<T, S extends string, A extends BaseArtifactType<any>> = {
    [key: string]: Partial<Config<T, S, A>>;
};
export declare function defaultIcon<T, S extends string, A extends BaseArtifactType<any>>(color: string): Config<T, S, A>;
//# sourceMappingURL=IconConfig.d.ts.map