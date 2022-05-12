export declare enum EWorkbenchType {
    PREVIOUS = "t-previous",
    FOCUS = "t-focus",
    CONTEXT = "t-context",
    NEXT = "t-next"
}
export interface IWorkbenchViewsProps {
    index: number;
    type: EWorkbenchType;
    isTransitioning: boolean;
}
export declare function WorkbenchViews({ index, type, isTransitioning }: IWorkbenchViewsProps): JSX.Element;
//# sourceMappingURL=WorkbenchViews.d.ts.map