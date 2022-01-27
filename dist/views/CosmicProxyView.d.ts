import { IVisynViewProps } from '../../../tdp_core/dist/views/VisynView';
import { ICosmicViewPluginDesc } from '../visyn/VisynView';
export declare function CosmicView({ desc, data, dataDesc, selection, filters, parameters, onSelectionChanged, onFiltersChanged, onParametersChanged }: IVisynViewProps<ICosmicViewPluginDesc, any>): JSX.Element;
export declare function CosmicViewHeader({ desc, data, dataDesc, selection, filters, parameters, onSelectionChanged, onFiltersChanged, onParametersChanged }: IVisynViewProps<ICosmicViewPluginDesc, any>): JSX.Element;
