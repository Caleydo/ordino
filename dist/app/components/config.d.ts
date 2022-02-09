import { ComponentType } from 'react';
import { IViewChooserHeaderProps, IBurgerButtonProps, IViewChooserFilterProps, IViewChooserAccordionProps, ISelectedViewIndicatorProps, ISelectionCountIndicatorProps } from '.';
export interface IChooserComponents {
    ViewChooserHeader: ComponentType<IViewChooserHeaderProps>;
    BurgerButton: ComponentType<IBurgerButtonProps>;
    ViewChooserFilter: ComponentType<IViewChooserFilterProps>;
    ViewChooserAccordion: ComponentType<IViewChooserAccordionProps>;
    SelectedViewIndicator: ComponentType<ISelectedViewIndicatorProps>;
    SelectionCountIndicator: ComponentType<ISelectionCountIndicatorProps>;
    ViewChooserFooter: ComponentType;
}
export declare const chooserComponents: Partial<IChooserComponents>;
export declare type ViewChooserExtensions = Partial<IChooserComponents>;
//# sourceMappingURL=config.d.ts.map