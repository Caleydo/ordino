import { IViewPluginDesc } from 'tdp_core';
interface IViewChooserAccordionProps {
    index: number;
    selectedView?: IViewPluginDesc;
    views: IViewPluginDesc[];
    onSelectedView: (view: IViewPluginDesc, viewIndex: number) => void;
}
export declare function ViewChooserAccordion(props: IViewChooserAccordionProps): JSX.Element;
export {};
