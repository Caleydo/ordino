import { ComponentType } from 'react';
import { AppDefaultLogo } from './headerComponents/AppDefaultLogo';
import { BurgerMenu, IBurgerMenuProps } from './headerComponents/BurgerMenu';
import { CustomerDefaultLogo } from './headerComponents/CustomerDefaultLogo';
import { DatavisynLogo } from './headerComponents/DatavisynLogo';
import { ISettingsMenuProps, SettingsMenu } from './headerComponents/SettingsMenu';
// eslint-disable-next-line import/no-cycle
import { LoginLink } from './LoginMenu';

export interface IVisynHeaderComponents {
  BurgerButton?: ComponentType<IBurgerMenuProps>;
  AppLogo?: ComponentType;
  VisynLogo?: ComponentType;
  LeftExtensions?: ComponentType;
  RightExtensions?: ComponentType;
  CustomerLogo?: ComponentType;
  SettingsMenu?: ComponentType<ISettingsMenuProps>;
}

export const visynHeaderComponents: Partial<IVisynHeaderComponents> = {
  VisynLogo: DatavisynLogo,
  CustomerLogo: CustomerDefaultLogo,
  BurgerButton: BurgerMenu,
  AppLogo: AppDefaultLogo,
  LeftExtensions: null,
  RightExtensions: null,
  SettingsMenu,
  LoginLink,
};

export type VisynHeaderExtensions = Partial<IVisynHeaderComponents>;
