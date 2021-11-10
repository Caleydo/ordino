import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from './usersSlice';
import { DatavisynLogo } from './headerComponents/DatavisynLogo';
import { CustomerDefaultLogo } from './headerComponents/CustomerDefaultLogo';
import { AppDefaultLogo } from './headerComponents/AppDefaultLogo';

import { BurgerMenu, IBurgerMenuProps } from './headerComponents/BurgerMenu';
import { ConfigurationMenu, IConfigurationMenuProps } from './headerComponents/ConfigurationMenu';
import {ComponentType} from 'react';
import {IBurgerButtonProps} from '../app/components';

// export interface ICommonVisynHeaderPluginProps {
//   //
// }

// export type IVisynHeaderPlugin<T extends {} = {}> = (
//   props: ICommonVisynHeaderPluginProps & T
// ) => React.ReactElement | null;

export interface IVisynHeaderProps {
  ConfigMenuOptions?: ComponentType;
  BurgerSidebar?: ComponentType;
  extensions?: {
    AppLogo?: ComponentType;
    VisynLogo?: ComponentType;
    LeftExtensions?: ComponentType;
    RightExtensions?: ComponentType;
    CustomerLogo?: ComponentType;
    ConfigMenu?: ComponentType<IConfigurationMenuProps>;
    BurgerButton?: ComponentType<IBurgerMenuProps>
  };
  burgerMenuEnabled?: boolean;
  configMenuEnabled?: boolean;
}

export function VisynHeader({
  ConfigMenuOptions = null,
  BurgerSidebar = null,
  extensions: {
    VisynLogo = DatavisynLogo,
    CustomerLogo = null,
    ConfigMenu = ConfigurationMenu,
    BurgerButton = BurgerMenu,
    AppLogo = AppDefaultLogo,
    LeftExtensions = null,
    RightExtensions = null
  } = {},
  burgerMenuEnabled = true,
  configMenuEnabled = true
}: IVisynHeaderProps) {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark phovea-navbar">
        <div className="container-fluid">
          {/* {burgerMenuEnabled ? <BurgerButton sidebar={<BurgerSidebar/>}/> : null} */}
          {AppLogo}
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#headerNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="ms-2 collapse navbar-collapse" id="headerNavbar">
            {LeftExtensions}
          </div>
        </div>

        <div className="container-fluid justify-content-end">
          {CustomerLogo}
          {VisynLogo}
          {/* {configMenuEnabled ? <ConfigMenu menuItems={<ConfigMenuOptions/>}/> : null} */}
        </div>
      </nav>
    </>
  );
}
