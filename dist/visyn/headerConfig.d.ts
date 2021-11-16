import { ComponentType } from 'react';
import { IConfigurationMenuProps, IBurgerMenuProps } from '.';
export interface IVisynHeaderComponents {
    AppLogo?: ComponentType;
    VisynLogo?: ComponentType;
    LeftExtensions?: ComponentType;
    RightExtensions?: ComponentType;
    CustomerLogo?: ComponentType;
    ConfigMenu?: ComponentType<IConfigurationMenuProps>;
    BurgerButton?: ComponentType<IBurgerMenuProps>;
}
export declare const visynHeaderComponents: Partial<IVisynHeaderComponents>;
export declare type visynHeaderExtensions = Partial<IVisynHeaderComponents>;
