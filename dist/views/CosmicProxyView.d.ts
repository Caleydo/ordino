import { IVisynViewPluginFactory } from '../../../tdp_core/dist';
import { IVisynViewProps } from '../../../tdp_core/dist/views/VisynView';
import { ICosmicViewPluginParams } from '../visyn/VisynView';
export declare function CosmicView({ desc, data, dataDesc, selection, idFilter, parameters, onSelectionChanged, onIdFilterChanged, onParametersChanged }: IVisynViewProps<any, ICosmicViewPluginParams>): JSX.Element;
export declare function CosmicViewHeader({ desc, data, dataDesc, selection, idFilter, parameters, onSelectionChanged, onIdFilterChanged, onParametersChanged }: IVisynViewProps<any, ICosmicViewPluginParams>): JSX.Element;
export declare const cosmicConfiguration: () => IVisynViewPluginFactory;
//# sourceMappingURL=CosmicProxyView.d.ts.map