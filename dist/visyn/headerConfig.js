import { AppDefaultLogo } from './headerComponents/AppDefaultLogo';
import { BurgerMenu } from './headerComponents/BurgerMenu';
import { CustomerDefaultLogo } from './headerComponents/CustomerDefaultLogo';
import { DatavisynLogo } from './headerComponents/DatavisynLogo';
import { SettingsMenu } from './headerComponents/SettingsMenu';
// eslint-disable-next-line import/no-cycle
import { LoginLink } from './LoginMenu';
export const visynHeaderComponents = {
    VisynLogo: DatavisynLogo,
    CustomerLogo: CustomerDefaultLogo,
    BurgerButton: BurgerMenu,
    AppLogo: AppDefaultLogo,
    LeftExtensions: null,
    RightExtensions: null,
    SettingsMenu,
    LoginLink,
};
//# sourceMappingURL=headerConfig.js.map