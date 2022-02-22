import { IVisynViewPluginFactory, IVisConfig, IVisynViewProps } from 'tdp_core';
export declare function VisVisynView({ desc, data, dataDesc, selection, idFilter, parameters, onSelectionChanged, onIdFilterChanged, onParametersChanged, }: IVisynViewProps<any, IVisConfig>): JSX.Element;
export declare function VisViewSidebar({ desc, data, dataDesc, selection, idFilter, parameters, onSelectionChanged, onIdFilterChanged, onParametersChanged, }: IVisynViewProps<any, IVisConfig>): JSX.Element;
export declare const visConfiguration: () => IVisynViewPluginFactory;
//# sourceMappingURL=VisVisynView.d.ts.map