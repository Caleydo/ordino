import { IWorkbench } from '../store/ordinoSlice';
import { EWorkbenchType } from './Filmstrip';
interface IWorkbenchProps {
    workbench: IWorkbench;
    type?: EWorkbenchType;
}
export declare function Workbench({ workbench, type }: IWorkbenchProps): JSX.Element;
export {};
