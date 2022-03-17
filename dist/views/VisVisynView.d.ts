import { IVisynViewPluginFactory, IVisConfig, IVisynViewProps } from 'tdp_core';
export declare function VisVisynView({ data, dataDesc, selection, idFilter, parameters, onSelectionChanged }: IVisynViewProps<any, IVisConfig>): JSX.Element;
export declare function VisViewSidebar({ data, dataDesc, selection, idFilter, parameters, onIdFilterChanged, onParametersChanged }: IVisynViewProps<any, IVisConfig>): JSX.Element;
export declare const visConfiguration: () => IVisynViewPluginFactory;
//# sourceMappingURL=VisVisynView.d.ts.map