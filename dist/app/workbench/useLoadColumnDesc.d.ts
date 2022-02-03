import { IReprovisynEntity } from 'reprovisyn';
export declare function useLoadColumnDesc(entityId: string, entityMeta: IReprovisynEntity): {
    execute: () => Promise<{
        _id: string;
        initialRanking: boolean;
        summary: string;
        width: number;
        searchable: boolean;
        column: string;
        label: string;
        type: "string" | "number" | "categorical";
        categories?: string[];
        min?: number;
        max?: number;
        selectedId: number;
        selectedSubtype?: string;
        chooserGroup?: {
            parent: string;
            order?: number;
        };
        description?: string;
        color?: string;
        frozen?: boolean;
        fixed?: boolean;
        renderer?: string;
        groupRenderer?: string;
        summaryRenderer?: string;
        visible?: boolean;
    }[]>;
    status: import("tdp_core").useAsyncStatus;
    value: {
        _id: string;
        initialRanking: boolean;
        summary: string;
        width: number;
        searchable: boolean;
        column: string;
        label: string;
        type: "string" | "number" | "categorical";
        categories?: string[];
        min?: number;
        max?: number;
        selectedId: number;
        selectedSubtype?: string;
        chooserGroup?: {
            parent: string;
            order?: number;
        };
        description?: string;
        color?: string;
        frozen?: boolean;
        fixed?: boolean;
        renderer?: string;
        groupRenderer?: string;
        summaryRenderer?: string;
        visible?: boolean;
    }[];
    error: Error;
};
