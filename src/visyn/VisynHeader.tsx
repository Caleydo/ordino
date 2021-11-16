import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addUser} from './usersSlice';
import {DatavisynLogo} from './headerComponents/DatavisynLogo';
import {CustomerDefaultLogo} from './headerComponents/CustomerDefaultLogo';
import {AppDefaultLogo} from './headerComponents/AppDefaultLogo';

import {BurgerMenu, IBurgerMenuProps} from './headerComponents/BurgerMenu';
import {ConfigurationMenu, IConfigurationMenuProps} from './headerComponents/ConfigurationMenu';
import {ComponentType} from 'react';
import {IBurgerButtonProps} from '../app/components';
import {IVisynHeaderComponents, visynHeaderComponents} from './headerConfig';

// export interface ICommonVisynHeaderPluginProps {
//   //
// }

// export type IVisynHeaderPlugin<T extends {} = {}> = (
//   props: ICommonVisynHeaderPluginProps & T
// ) => React.ReactElement | null;

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
  configMenuEnabled = true
}: IVisynHeaderProps) {


  const {AppLogo, VisynLogo, CustomerLogo, BurgerButton, LeftExtensions, RightExtensions, ConfigMenu} = {...visynHeaderComponents, ...extensions};

  console.log(AppLogo, VisynLogo, CustomerLogo, BurgerButton, LeftExtensions, RightExtensions, ConfigMenu);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark phovea-navbar">
        <div className="container-fluid">
          {/* {burgerMenuEnabled ? <BurgerButton sidebar={<BurgerSidebar/>}/> : null} */}
          {<AppLogo />}
          <div className="ms-2 collapse navbar-collapse" id="headerNavbar">
            {/* {LeftExtensions} */}
          </div>
        </div>

        <div className="container-fluid justify-content-end">
          <CustomerLogo />
          <VisynLogo />
          {/* {configMenuEnabled ? <ConfigMenu menuItems={<ConfigMenuOptions/>}/> : null} */}
        </div>
      </nav>
    </>
  );
}
