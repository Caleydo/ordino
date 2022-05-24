import { VisynSimpleViewPluginType } from 'tdp_core';
declare type CosmicViewPluginType = VisynSimpleViewPluginType<{
    currentId: string;
}>;
export declare function CosmicView({ parameters, onParametersChanged }: CosmicViewPluginType['props']): JSX.Element;
export declare function CosmicViewHeader({ selection, parameters, onParametersChanged }: CosmicViewPluginType['props']): JSX.Element;
export declare const cosmicConfiguration: () => CosmicViewPluginType['definition'];
export {};
//# sourceMappingURL=CosmicProxyView.d.ts.map