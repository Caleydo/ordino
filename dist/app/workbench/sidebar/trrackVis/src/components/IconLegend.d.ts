import { BaseArtifactType } from '@trrack/core';
import { ProvVisConfig } from './ProvVis';
import { StratifiedMap } from './useComputeNodePosition';
export declare function IconLegend<T, S extends string, A extends BaseArtifactType<any>>({ colorMap, nodes, config, }: {
    colorMap: Record<S | 'Root', string>;
    nodes: StratifiedMap<T, S, A>;
    config: ProvVisConfig<T, S, A>;
}): JSX.Element;
//# sourceMappingURL=IconLegend.d.ts.map