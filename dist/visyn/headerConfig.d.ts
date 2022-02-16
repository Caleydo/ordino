import { ComponentType } from 'react';
import { ISettingsMenuProps, IBurgerMenuProps } from '.';
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
export declare type visynHeaderExtensions = Partial<IVisynHeaderComponents>;
//# sourceMappingURL=headerConfig.d.ts.map