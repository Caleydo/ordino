import { ComponentType } from 'react';
import {
  IViewChooserHeaderProps,
  IBurgerButtonProps,
  IViewChooserFilterProps,
  IViewChooserAccordionProps,
  ISelectedViewIndicatorProps,
  ISelectionCountIndicatorProps,
  ViewChooserHeader,
  BurgerButton,
  ViewChooserAccordion,
  ViewChooserFilter,
  SelectedViewIndicator,
  SelectionCountIndicator,
  ViewChooserFooter,
} from '.';

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
