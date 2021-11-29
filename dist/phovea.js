/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
import { PluginRegistry } from 'tdp_core';
import { EP_ORDINO_LOGO } from './base';
export default function (registry) {
    //registry.push('extension-type', 'extension-id', function() { return import('./extension_impl'); }, {});
    // generator-phovea:begin
    registry.push(EP_ORDINO_LOGO, 'ordino_logo', () => import('ordino/dist/assets/logos/ordino.svg').then(PluginRegistry.getInstance().asResource), {
        text: 'Ordino',
        width: 30,
        height: 30
    });
    // generator-phovea:end
}
//# sourceMappingURL=phovea.js.map