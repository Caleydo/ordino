import { IViewPluginDesc } from 'tdp_core';
export interface IViewChooserAccordionProps {
    /**
     * Views to render
     */
    views: IViewPluginDesc[];
    /**
     * Open view callback
     */
    onSelectedView: (view: IViewPluginDesc) => void;
    /**
     * Currently open view
     */
    selectedView?: IViewPluginDesc;
}
export declare function ViewChooserAccordion(props: IViewChooserAccordionProps): JSX.Element;
//# sourceMappingURL=ViewChooserAccordion.d.ts.map