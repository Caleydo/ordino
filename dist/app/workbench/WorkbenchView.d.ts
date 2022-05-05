import * as React from 'react';
import { MosaicBranch, MosaicPath } from 'react-mosaic-component';
import { IWorkbenchView } from '../../store';
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
        view: React.ComponentType<Record<string, any> & {
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
        header?: React.ComponentType<Record<string, any> & {
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
        tab?: React.ComponentType<Record<string, any> & {
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
export declare function WorkbenchView({ workbenchIndex, view, dragMode, path, setMosaicDrag, removeCallback, }: {
    workbenchIndex: number;
    view: IWorkbenchView;
    dragMode: boolean;
    path: MosaicBranch[];
    setMosaicDrag: (b: boolean) => void;
    removeCallback: (path: MosaicPath) => void;
}): JSX.Element;
//# sourceMappingURL=WorkbenchView.d.ts.map