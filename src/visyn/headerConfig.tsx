import React, {ComponentType} from 'react';
import {ISettingsMenuProps, IBurgerMenuProps, DatavisynLogo, BurgerMenu, CustomerDefaultLogo, SettingsMenu, AppDefaultLogo} from '.';
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
    SettingsMenu: SettingsMenu
};

export type visynHeaderExtensions = Partial<IVisynHeaderComponents>;
