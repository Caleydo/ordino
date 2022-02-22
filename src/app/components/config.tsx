import { ComponentType } from 'react';
import { BurgerButton, IBurgerButtonProps } from './BurgerButton';
import { ISelectedViewIndicatorProps, SelectedViewIndicator } from './SelectedViewIndicator';
import { ISelectionCountIndicatorProps, SelectionCountIndicator } from './SelectionCountIndicator';
import { IViewChooserAccordionProps, ViewChooserAccordion } from './ViewChooserAccordion';
import { IViewChooserFilterProps, ViewChooserFilter } from './ViewChooserFilter';
import { ViewChooserFooter } from './ViewChooserFooter';
import { IViewChooserHeaderProps, ViewChooserHeader } from './ViewChooserHeader';

export interface IChooserComponents {
  ViewChooserHeader: ComponentType<IViewChooserHeaderProps>;
  BurgerButton: ComponentType<IBurgerButtonProps>;
  ViewChooserFilter: ComponentType<IViewChooserFilterProps>;
  ViewChooserAccordion: ComponentType<IViewChooserAccordionProps>;
  SelectedViewIndicator: ComponentType<ISelectedViewIndicatorProps>;
  SelectionCountIndicator: ComponentType<ISelectionCountIndicatorProps>;
  ViewChooserFooter: ComponentType;
}

export const chooserComponents: Partial<IChooserComponents> = {
  ViewChooserHeader,
  BurgerButton,
  ViewChooserFilter,
  ViewChooserAccordion,
  SelectedViewIndicator,
  SelectionCountIndicator,
  ViewChooserFooter,
};

export type ViewChooserExtensions = Partial<IChooserComponents>;
