import { IOrdinoViewPluginDesc } from '../store/ordinoSlice';
export declare function Workbench(props: {
    view: IOrdinoViewPluginDesc;
    type: 'Previous' | 'Context' | 'Focus' | 'Next' | 'First' | 'Next_DVC';
}): JSX.Element;
