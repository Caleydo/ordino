import { IViewPluginDesc } from 'tdp_core';
import { ViewChooserExtensions } from './components';
export declare enum ECollapseDirection {
    LEFT = "left",
    RIGHT = "right"
}
export interface IViewGroupDesc {
    name: string;
    items: IViewPluginDesc[];
}
interface IViewChooserProps {
    /**
     * Available views for idType
     */
    views: IViewPluginDesc[];
    /**
     * Open the view callback
     */
    onSelectedView: (view: IViewPluginDesc) => void;
    /**
     * Currently open view
     */
    selectedView?: IViewPluginDesc;
    /**
     * Show burger menu
     * @default true
     */
    showBurgerMenu?: boolean;
    /**
     * Show filter
     * @default true
     */
    showFilter?: boolean;
    /**
     * Show header
     * @default true
     */
    showHeader?: boolean;
    /**
     * Show footer
     * @default true
     */
    showFooter?: boolean;
    /**
     * @default left
     */
    collapseDirection?: ECollapseDirection;
    extensions?: ViewChooserExtensions;
}
export declare function ViewChooser({ views, onSelectedView, selectedView, showBurgerMenu, showFilter, showHeader, collapseDirection, extensions: { ViewChooserHeader, BurgerButton, SelectedViewIndicator, SelectionCountIndicator, ViewChooserAccordion, ViewChooserFilter, ViewChooserFooter } }: IViewChooserProps): JSX.Element;
export {};
