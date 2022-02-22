import { IWorkbench } from '../store/ordinoSlice';
export declare enum EWorkbenchType {
    PREVIOUS = "t-previous",
    FOCUS = "t-focus",
    CONTEXT = "t-context",
    NEXT = "t-next"
}
interface IWorkbenchProps {
    workbench: IWorkbench;
    type?: EWorkbenchType;
}
export declare function Workbench({ workbench, type }: IWorkbenchProps): JSX.Element;
export {};
//# sourceMappingURL=Workbench.d.ts.map