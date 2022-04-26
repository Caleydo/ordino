import { PayloadAction } from '@reduxjs/toolkit';
import { IWorkbenchView } from './interfaces';
export declare const viewsReducers: {
    addView(state: any, action: PayloadAction<{
        workbenchIndex: number;
        view: IWorkbenchView;
    }>): void;
    setViewParameters(state: any, action: PayloadAction<{
        workbenchIndex: number;
        viewIndex: number;
        parameters: any;
    }>): void;
    setView(state: any, action: PayloadAction<{
        workbenchIndex: number;
        viewIndex: number;
        viewId: string;
        viewName: string;
    }>): void;
    switchViews(state: any, action: PayloadAction<{
        workbenchIndex: number;
        firstViewIndex: number;
        secondViewIndex: number;
    }>): void;
    removeView(state: any, action: PayloadAction<{
        workbenchIndex: number;
        viewIndex: number;
    }>): void;
};
//# sourceMappingURL=viewsReducer.d.ts.map