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
    workbenchName: string;
    /**
     * Currently open view
     */
    selectedView?: IViewPluginDesc;
    isTransitionActive: boolean;
}
export declare function ViewChooserAccordion({ views, onSelectedView, workbenchName, selectedView, isTransitionActive }: IViewChooserAccordionProps): JSX.Element;
//# sourceMappingURL=ViewChooserAccordion.d.ts.map