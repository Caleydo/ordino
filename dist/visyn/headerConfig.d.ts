import { ComponentType } from 'react';
import { IBurgerMenuProps } from './headerComponents/BurgerMenu';
import { ISettingsMenuProps } from './headerComponents/SettingsMenu';
export interface IVisynHeaderComponents {
    BurgerButton?: ComponentType<IBurgerMenuProps>;
    AppLogo?: ComponentType;
    VisynLogo?: ComponentType;
    LeftExtensions?: ComponentType;
    RightExtensions?: ComponentType;
    CustomerLogo?: ComponentType;
    SettingsMenu?: ComponentType<ISettingsMenuProps>;
}
export declare const visynHeaderComponents: Partial<IVisynHeaderComponents>;
export declare type VisynHeaderExtensions = Partial<IVisynHeaderComponents>;
//# sourceMappingURL=headerConfig.d.ts.map