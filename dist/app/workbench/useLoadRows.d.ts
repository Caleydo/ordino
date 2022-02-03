import { IViewPluginDesc } from 'tdp_core';
export declare function useLoadData(entityId: string, viewDesc: IViewPluginDesc): (any[] | "idle" | "pending" | "success" | "error")[];
