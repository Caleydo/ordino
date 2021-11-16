import React, {ComponentType} from 'react';
import {IConfigurationMenuProps, IBurgerMenuProps, DatavisynLogo, BurgerMenu, CustomerDefaultLogo} from '.';
import {AppDefaultLogo} from './headerComponents';
export interface IVisynHeaderComponents {
    AppLogo?: ComponentType;
    VisynLogo?: ComponentType;
    LeftExtensions?: ComponentType;
    RightExtensions?: ComponentType;
    CustomerLogo?: ComponentType;
    ConfigMenu?: ComponentType<IConfigurationMenuProps>;
    BurgerButton?: ComponentType<IBurgerMenuProps>;
}

export const visynHeaderComponents: Partial<IVisynHeaderComponents> = {
    VisynLogo: DatavisynLogo,
    CustomerLogo: CustomerDefaultLogo,
    BurgerButton: BurgerMenu,
    AppLogo:AppDefaultLogo,
    LeftExtensions: null,
    RightExtensions: null,
    ConfigMenu: null
};

export type visynHeaderExtensions = Partial<IVisynHeaderComponents>;
