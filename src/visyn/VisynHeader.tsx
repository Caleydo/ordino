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
  burgerMenuEnabled = false,
}: IVisynHeaderProps) {
  const {AppLogo, VisynLogo, CustomerLogo, BurgerButton, LeftExtensions, RightExtensions, SettingsMenu} = {...visynHeaderComponents, ...extensions};


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{height: '50px'}}>
        <div className="container-fluid">
          {AppLogo ? <AppLogo /> : null}
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse">
            {LeftExtensions ? <LeftExtensions /> : null}
            <ul className="navbar-nav ms-auto align-items-center">
              {CustomerLogo ? <CustomerLogo /> : null}
              {VisynLogo ? <VisynLogo /> : null}
              {SettingsMenu ? <SettingsMenu menuItems={ConfigMenuOptions ? <ConfigMenuOptions /> : null} /> : null}
            </ul>
            {RightExtensions ? <RightExtensions /> : null}
          </div>
        </div>
      </nav>
    </>
  );
}