import { IReprovisynEntity } from 'reprovisyn';
import { IViewPluginDesc } from 'tdp_core';
export declare function useLoadData(entityId: string, entityMetadata: IReprovisynEntity, viewDesc: IViewPluginDesc, inputSelection?: string[]): {
    status: import("tdp_core").useAsyncStatus;
    data: any[];
};
