import { ComponentType } from 'react';
import { IBurgerButtonProps } from './BurgerButton';
import { ISelectedViewIndicatorProps } from './SelectedViewIndicator';
import { ISelectionCountIndicatorProps } from '../SelectionCountIndicator';
import { IViewChooserAccordionProps } from './ViewChooserAccordion';
import { IViewChooserFilterProps } from './ViewChooserFilter';
import { IViewChooserHeaderProps } from './ViewChooserHeader';
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