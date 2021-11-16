import * as React from 'react';
import { visynHeaderComponents } from './headerConfig';
export function VisynHeader({ ConfigMenuOptions = null, BurgerSidebar = null, extensions = {}, burgerMenuEnabled = true, }) {
    const { AppLogo, VisynLogo, CustomerLogo, BurgerButton, LeftExtensions, RightExtensions, SettingsMenu } = { ...visynHeaderComponents, ...extensions };
    console.log(AppLogo, VisynLogo, CustomerLogo, BurgerButton, LeftExtensions, RightExtensions, SettingsMenu);
    return (React.createElement(React.Fragment, null,
        React.createElement("nav", { className: "navbar navbar-expand-lg navbar-dark bg-dark phovea-navbar" },
            React.createElement("div", { className: "container-fluid" },
                React.createElement(AppLogo, null),
                React.createElement("div", { className: "ms-2 collapse navbar-collapse", id: "headerNavbar" }, LeftExtensions ? React.createElement(LeftExtensions, null) : null)),
            React.createElement("div", { className: "container-fluid justify-content-end" },
                React.createElement(CustomerLogo, null),
                React.createElement(VisynLogo, null),
                SettingsMenu ? React.createElement(SettingsMenu, { menuItems: ConfigMenuOptions ? React.createElement(ConfigMenuOptions, null) : null }) : null))));
}
//# sourceMappingURL=VisynHeader.js.map