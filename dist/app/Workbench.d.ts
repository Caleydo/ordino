import { IOrdinoViewPluginDesc } from '../store/ordinoSlice';
import { EWorkbenchType } from './Filmstrip';
interface IWorkbenchProps {
    view: IOrdinoViewPluginDesc;
    type?: EWorkbenchType;
}
export declare function Workbench({ view, type }: IWorkbenchProps): JSX.Element;
export {};
