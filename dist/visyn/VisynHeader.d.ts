import { ComponentType } from 'react';
import { IVisynHeaderComponents } from './headerConfig';
export interface IVisynHeaderProps {
    ConfigMenuOptions?: ComponentType;
    BurgerSidebar?: ComponentType;
    extensions?: IVisynHeaderComponents;
    burgerMenuEnabled?: boolean;
    configMenuEnabled?: boolean;
}
export declare function VisynHeader({ ConfigMenuOptions, BurgerSidebar, extensions, burgerMenuEnabled, }: IVisynHeaderProps): JSX.Element;
//# sourceMappingURL=VisynHeader.d.ts.map