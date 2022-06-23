/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
import { EP_PHOVEA_CORE_LOCALE, ILocaleEPDesc, IRegistry, PluginRegistry } from 'tdp_core';
import { EP_ORDINO_LOGO, IOrdinoLogoDesc } from './base';

export default function (registry: IRegistry) {
  // registry.push('extension-type', 'extension-id', function() { return import('./extension_impl'); }, {});
  // generator-phovea:begin
  registry.push(
    EP_ORDINO_LOGO,
    'ordino_logo',
    () => import('tdp_core/dist/assets/icons/datavisyn_logo_blue_white.svg').then(PluginRegistry.getInstance().asResource),
    <IOrdinoLogoDesc>{
      text: 'Ordino',
      width: 24,
      height: 24,
    },
  );

  registry.push(
    EP_PHOVEA_CORE_LOCALE,
    'tdpLocaleEN',
    function () {
      return import('./locales/en/tdp.json').then(PluginRegistry.getInstance().asResource);
    },
    <ILocaleEPDesc>{
      ns: 'tdp',
    },
  );

  registry.push(
    EP_PHOVEA_CORE_LOCALE,
    'ordinoLocaleEN',
    function () {
      return import('./locales/en/tdp.json').then(PluginRegistry.getInstance().asResource);
    },
    <ILocaleEPDesc>{
      order: 1,
      ns: 'tdp',
    },
  );

  // generator-phovea:end
}
