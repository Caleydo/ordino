import { PayloadAction } from '@reduxjs/toolkit';
import { ISelectedMapping, IWorkbench } from './interfaces';
export declare const workbenchReducers: {
    addFirstWorkbench(state: any, action: PayloadAction<{
        workbench: IWorkbench;
        globalQueryName: string;
        globalQueryCategories: string[];
        appliedQueryCategories: string[];
    }>): void;
    addWorkbench(state: any, action: PayloadAction<IWorkbench>): void;
    changeSelectedMappings(state: any, action: PayloadAction<{
        workbenchIndex: number;
        newMapping: ISelectedMapping;
    }>): void;
    removeWorkbench(state: any, action: PayloadAction<{
        index: number;
    }>): void;
    replaceWorkbench(state: any, action: PayloadAction<{
        workbenchIndex: number;
        newWorkbench: IWorkbench;
    }>): void;
    addSelection(state: any, action: PayloadAction<{
        workbenchIndex: number;
        newSelection: string[];
    }>): void;
    addFilter(state: any, action: PayloadAction<{
        workbenchIndex: number;
        viewId: string;
        filter: string[];
    }>): void;
};
//# sourceMappingURL=workbenchReducer.d.ts.map