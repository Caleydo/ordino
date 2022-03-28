import * as React from 'react';
import { ComponentType } from 'react';
import { IVisynHeaderComponents, visynHeaderComponents } from './headerConfig';

export interface IVisynHeaderProps {
  ConfigMenuOptions?: ComponentType;
  BurgerSidebar?: ComponentType;
  extensions?: IVisynHeaderComponents;
  burgerMenuEnabled?: boolean;
}

export function VisynHeader({ ConfigMenuOptions = null, BurgerSidebar = null, extensions = {}, burgerMenuEnabled = false }: IVisynHeaderProps) {
  const { AppLogo, VisynLogo, CustomerLogo, BurgerButton, LeftExtensions, RightExtensions, SettingsMenu } = { ...visynHeaderComponents, ...extensions };

  return (
    <nav className=" visyn-navbar navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {AppLogo ? <AppLogo /> : null}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse">
          {LeftExtensions ? <LeftExtensions /> : null}
          <ul className="navbar-nav ms-auto align-items-end">
            {CustomerLogo ? <CustomerLogo /> : null}
            {VisynLogo ? <VisynLogo /> : null}
          </ul>
          <ul className="navbar-nav align-items-end">
            {RightExtensions ? <RightExtensions /> : null}
            {SettingsMenu ? <SettingsMenu menuItems={ConfigMenuOptions ? <ConfigMenuOptions /> : null} /> : null}
          </ul>
        </div>
      </div>
    </nav>
  );
}
