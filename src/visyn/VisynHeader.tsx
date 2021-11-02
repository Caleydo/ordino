import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from './usersSlice';
import { DatavisynLogo } from './headerComponents/DatavisynLogo';
import { CustomerDefaultLogo } from './headerComponents/CustomerDefaultLogo';
import { AppDefaultLogo } from './headerComponents/AppDefaultLogo';

import { BurgerMenu } from './headerComponents/BurgerMenu';
import { ConfigurationMenu } from './headerComponents/ConfigurationMenu';

// export interface ICommonVisynHeaderPluginProps {
//   //
// }

// export type IVisynHeaderPlugin<T extends {} = {}> = (
//   props: ICommonVisynHeaderPluginProps & T
// ) => React.ReactElement | null;

export interface IVisynHeaderProps {
  extensions?: {
    AppLogo?: React.ReactElement | null;
    VisynLogo?: React.ReactElement | null;
    LeftExtensions?: React.ReactElement | null;
    RightExtensions?: React.ReactElement | null;
    CustomerLogo?: React.ReactElement | null;
    configurationMenu?: React.ReactElement<{
      extensions: {
        menuItems: React.ReactElement | null;
      };
    }> | null;
    burgerMenu?: React.ReactElement<{
      extensions: {
        sidebar: React.ReactElement | null;
      };
    }> | null;
  };
  burgerMenuEnabled?: boolean;
  configMenuEnabled?: boolean;
}

export function VisynHeader({
  extensions: {
    VisynLogo = <DatavisynLogo />,
    CustomerLogo = null,
    configurationMenu = <ConfigurationMenu extensions={{ menuItems: null }} />,
    burgerMenu = <BurgerMenu extensions={{ sidebar: null }} />,
    AppLogo = <AppDefaultLogo />,
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
          {burgerMenuEnabled ? burgerMenu : null}
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
          {configMenuEnabled ? configurationMenu : null}
        </div>
      </nav>
    </>
  );
}
