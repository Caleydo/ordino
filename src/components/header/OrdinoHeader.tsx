import * as React from 'react';
import {ConfigMenuOptions, ConfigurationMenu, HeaderTabs, OrdinoLogo2, VisynHeader} from '../..';
import {ITab} from './menu/StartMenuTabWrapper';

export interface IOrdinoHeaderProps {
  extensions?: {
    tabs?: ITab[],
    customerLogo?: React.ReactElement | null,
  };
}

export function OrdinoHeader({
    extensions: {
        tabs = null,
        customerLogo = null,
    } = {}
}: IOrdinoHeaderProps) {
  return (
    <VisynHeader
        burgerMenuEnabled={false}
        extensions={{
            CustomerLogo: customerLogo,
            AppLogo: <OrdinoLogo2 />,
            LeftExtensions: <HeaderTabs />,
            configurationMenu: <ConfigurationMenu extensions={{menuItems: <ConfigMenuOptions />}} />
        }}
    />
  );
}
