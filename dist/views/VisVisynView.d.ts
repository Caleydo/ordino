import { VisynDataViewPluginType, IVisConfig } from 'tdp_core';
declare type VisViewPluginType = VisynDataViewPluginType<{
    visConfig: IVisConfig | null;
}>;
export declare function VisVisynView({ data, dataDesc, selection, idFilter, parameters, onSelectionChanged }: VisViewPluginType['props']): JSX.Element;
export declare function VisViewSidebar({ data, dataDesc, selection, idFilter, parameters, onIdFilterChanged, onParametersChanged }: VisViewPluginType['props']): JSX.Element;
export declare const visConfiguration: () => VisViewPluginType['definition'];
export {};
//# sourceMappingURL=VisVisynView.d.ts.map