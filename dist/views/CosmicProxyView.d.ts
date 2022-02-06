import { IVisynViewProps } from '../../../tdp_core/dist/views/VisynView';
import { ICosmicViewPluginParams } from '../visyn/VisynView';
export declare function CosmicView({ desc, entityId, data, dataDesc, selection, filters, parameters, onSelectionChanged, onFiltersChanged, onParametersChanged }: IVisynViewProps<any, ICosmicViewPluginParams>): JSX.Element;
export declare function CosmicViewHeader({ desc, entityId, data, dataDesc, selection, filters, parameters, onSelectionChanged, onFiltersChanged, onParametersChanged }: IVisynViewProps<any, ICosmicViewPluginParams>): JSX.Element;
