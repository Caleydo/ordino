import * as React from 'react';
import {ComponentType} from 'react';
import {IVisynHeaderComponents, visynHeaderComponents} from './headerConfig';

export interface IVisynHeaderProps {
  ConfigMenuOptions?: ComponentType;
  BurgerSidebar?: ComponentType;
  extensions?: IVisynHeaderComponents;
  burgerMenuEnabled?: boolean;
  configMenuEnabled?: boolean;
}

export function VisynHeader({
  ConfigMenuOptions = null,
  BurgerSidebar = null,
  extensions = {},
  burgerMenuEnabled = true,
}: IVisynHeaderProps) {


  const {AppLogo, VisynLogo, CustomerLogo, BurgerButton, LeftExtensions, RightExtensions, SettingsMenu} = {...visynHeaderComponents, ...extensions};

  console.log(AppLogo, VisynLogo, CustomerLogo, BurgerButton, LeftExtensions, RightExtensions, SettingsMenu);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark phovea-navbar">
        <div className="container-fluid">
          {<AppLogo />}
          <div className="ms-2 collapse navbar-collapse" id="headerNavbar">
            {LeftExtensions ? <LeftExtensions /> : null}
          </div>
        </div>

        <div className="container-fluid justify-content-end">
          <CustomerLogo />
          <VisynLogo />
          {SettingsMenu ? <SettingsMenu menuItems={ConfigMenuOptions ? <ConfigMenuOptions /> : null} /> : null}
        </div>
      </nav>
    </>
  );
}
