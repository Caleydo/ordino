import { PayloadAction } from '@reduxjs/toolkit';
import { IColumnDesc } from 'lineupjs';
import { IRow } from 'tdp_core';
import { EWorkbenchDirection, ISelectedMapping, IWorkbench } from './interfaces';
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
    setDetailsSidebarOpen(state: any, action: PayloadAction<{
        workbenchIndex: number;
        open: boolean;
    }>): void;
    setCreateNextWorkbenchSidebarOpen(state: any, action: PayloadAction<{
        workbenchIndex: number;
        open: boolean;
    }>): void;
    createColumnDescs(state: any, action: PayloadAction<{
        workbenchIndex: number;
        desc: any;
    }>): void;
    addColumnDesc(state: any, action: PayloadAction<{
        workbenchIndex: number;
        desc: any;
    }>): void;
    setWorkbenchDirection(state: any, action: PayloadAction<{
        workbenchIndex: number;
        direction: EWorkbenchDirection;
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
    setWorkbenchData(state: any, action: PayloadAction<{
        workbenchIndex: number;
        data: IRow[];
    }>): void;
    addScoreColumn(state: any, action: {
        payload: {
            workbenchIndex: number;
            desc: IColumnDesc & {
                [key: string]: any;
            };
            data: any[];
        };
        type: string;
    }): void;
    setCommentsOpen(state: any, action: PayloadAction<{
        workbenchIndex: number;
        isOpen: boolean;
    }>): void;
};
//# sourceMappingURL=workbenchReducer.d.ts.map