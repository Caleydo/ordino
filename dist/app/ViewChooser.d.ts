import { IViewPluginDesc } from 'tdp_core';
import { ViewChooserExtensions } from './components';
export declare enum EViewChooserMode {
    EMBEDDED = 0,
    OVERLAY = 1
}
export declare enum EExpandMode {
    LEFT = 0,
    RIGHT = 1
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
     * EMBEDDED = ViewChooser has full width and does not collapse
     * OVERLAY= ViewChooser is collapsed by default and expands left or right on hover
     */
    mode?: EViewChooserMode;
    expand?: EExpandMode;
    /**
     * Pass custom classes to chooser
     */
    classNames?: string;
    /**
     * Weather it should be embedded
     */
    isEmbedded: boolean;
    /**
     * Overwrite default components with custom ones
     *
     */
    extensions?: ViewChooserExtensions;
}
export declare function ViewChooser({ views, onSelectedView, selectedView, showBurgerMenu, showFilter, showHeader, showFooter, mode, expand, classNames, extensions: { ViewChooserHeader, BurgerButton, SelectedViewIndicator, SelectionCountIndicator, ViewChooserAccordion, ViewChooserFilter, ViewChooserFooter } }: IViewChooserProps): JSX.Element;
export {};
