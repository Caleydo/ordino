import * as React from 'react';
import { IWorkbenchView } from '../../store';
export interface IWorkbenchSingleViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
}
export declare function getVisynView(entityId: string): Promise<({
    load(): Promise<{
        desc: any & import("tdp_core").IBaseViewPluginDesc & {
            readonly [key: string]: any;
            visynViewType: string;
            defaultParameters?: Record<string, any>;
        } & Record<string, any>;
        viewType: string;
        defaultParameters: Record<string, any>;
        factory: never;
    } & {
        view: React.ComponentClass<Record<string, any> & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: string;
                defaultParameters?: Record<string, any>;
            } & Record<string, any> & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, any>;
            onSelectionChanged(selection: React.SetStateAction<string[]>): void;
            onParametersChanged(parameters: React.SetStateAction<Record<string, any>>): void;
        }, any> | React.FunctionComponent<Record<string, any> & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: string;
                defaultParameters?: Record<string, any>;
            } & Record<string, any> & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, any>;
            onSelectionChanged(selection: React.SetStateAction<string[]>): void;
            onParametersChanged(parameters: React.SetStateAction<Record<string, any>>): void;
        }> | React.LazyExoticComponent<React.ComponentType<Record<string, any> & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: string;
                defaultParameters?: Record<string, any>;
            } & Record<string, any> & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, any>;
            onSelectionChanged(selection: React.SetStateAction<string[]>): void;
            onParametersChanged(parameters: React.SetStateAction<Record<string, any>>): void;
        }>>;
        header?: React.ComponentClass<Record<string, any> & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: string;
                defaultParameters?: Record<string, any>;
            } & Record<string, any> & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, any>;
            onSelectionChanged(selection: React.SetStateAction<string[]>): void;
            onParametersChanged(parameters: React.SetStateAction<Record<string, any>>): void;
        }, any> | React.FunctionComponent<Record<string, any> & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: string;
                defaultParameters?: Record<string, any>;
            } & Record<string, any> & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, any>;
            onSelectionChanged(selection: React.SetStateAction<string[]>): void;
            onParametersChanged(parameters: React.SetStateAction<Record<string, any>>): void;
        }> | React.LazyExoticComponent<React.ComponentType<Record<string, any> & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: string;
                defaultParameters?: Record<string, any>;
            } & Record<string, any> & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, any>;
            onSelectionChanged(selection: React.SetStateAction<string[]>): void;
            onParametersChanged(parameters: React.SetStateAction<Record<string, any>>): void;
        }>>;
        tab?: React.ComponentClass<Record<string, any> & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: string;
                defaultParameters?: Record<string, any>;
            } & Record<string, any> & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, any>;
            onSelectionChanged(selection: React.SetStateAction<string[]>): void;
            onParametersChanged(parameters: React.SetStateAction<Record<string, any>>): void;
        }, any> | React.FunctionComponent<Record<string, any> & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: string;
                defaultParameters?: Record<string, any>;
            } & Record<string, any> & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, any>;
            onSelectionChanged(selection: React.SetStateAction<string[]>): void;
            onParametersChanged(parameters: React.SetStateAction<Record<string, any>>): void;
        }> | React.LazyExoticComponent<React.ComponentType<Record<string, any> & {
            desc: any & import("tdp_core").IBaseViewPluginDesc & {
                readonly [key: string]: any;
                visynViewType: string;
                defaultParameters?: Record<string, any>;
            } & Record<string, any> & import("tdp_core").IPluginDesc;
        } & {
            selection: string[];
            parameters: Record<string, any>;
            onSelectionChanged(selection: React.SetStateAction<string[]>): void;
            onParametersChanged(parameters: React.SetStateAction<Record<string, any>>): void;
        }>>;
    } & import("tdp_core").IPlugin>;
} & import("tdp_core").IBaseViewPluginDesc & {
    readonly [key: string]: any;
    visynViewType: string;
    defaultParameters?: Record<string, any>;
} & Record<string, any> & import("tdp_core").IPluginDesc)[]>;
export declare function WorkbenchSingleView({ workbenchIndex, view }: IWorkbenchSingleViewProps): JSX.Element;
//# sourceMappingURL=WorkbenchSingleView.d.ts.map