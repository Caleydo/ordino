import { IOrdinoViewPluginDesc } from '../store/ordinoSlice';
import { EWorkbenchType } from './Filmstrip';
interface IWorkbenchProps {
    view: IOrdinoViewPluginDesc;
    type?: EWorkbenchType;
    onScrollTo?: (scrollAmount: number) => void;
}
export declare function Workbench({ view, type, onScrollTo }: IWorkbenchProps): JSX.Element;
export {};
