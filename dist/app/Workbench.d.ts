import { IWorkbench } from '../store/ordinoSlice';
import { EWorkbenchType } from './workbench/WorkbenchViews';
interface IWorkbenchProps {
    workbench: IWorkbench;
    type?: EWorkbenchType;
}
export declare function Workbench({ workbench, type }: IWorkbenchProps): JSX.Element;
export {};
//# sourceMappingURL=Workbench.d.ts.map