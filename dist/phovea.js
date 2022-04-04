/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
import { EP_PHOVEA_CORE_LOCALE, PluginRegistry } from 'tdp_core';
import { EP_ORDINO_LOGO } from './base';
export default function (registry) {
    // registry.push('extension-type', 'extension-id', function() { return import('./extension_impl'); }, {});
    // generator-phovea:begin
    registry.push(EP_ORDINO_LOGO, 'ordino_logo', () => import('tdp_core/dist/assets/icons/datavisyn_logo_blue_white.svg').then(PluginRegistry.getInstance().asResource), {
        text: 'Ordino',
        width: 24,
        height: 24,
    });
    registry.push(EP_PHOVEA_CORE_LOCALE, 'tdpLocaleEN', function () {
        return import('./locales/en/tdp.json').then(PluginRegistry.getInstance().asResource);
    }, {
        ns: 'tdp',
    });
    registry.pushVisynView('cosmic', () => import('./views/CosmicProxyView').then((m) => m.cosmicConfiguration), {
        visynViewType: 'simple',
        factory: 'cosmicConfiguration',
        name: 'COSMIC',
        site: 'https://cancer.sanger.ac.uk/cell_lines/sample/overview?id={cosmicid}&genome=38',
        argument: 'cosmicid',
        idtype: 'ordino_public.cellline.tdp_cellline',
        selection: 'chooser',
        group: {
            name: 'External Resources',
            order: 0,
        },
        filter: {
            species: 'human',
        },
        description: 'Show information on your search from COSMIC',
        topics: ['cellline', 'external'],
    });
    registry.pushVisynView('vis', () => import('./views/VisVisynView').then((m) => m.visConfiguration), {
        visynViewType: 'data',
        name: 'Vis',
        factory: 'visConfiguration',
        idtype: 'ordino_public.cellline.tdp_cellline',
        selection: 'multiple',
        group: {
            name: 'Vis',
            order: 0,
        },
        description: 'Shows all information from the database for the searched genes',
        topics: ['tcga', 'information'],
    });
    registry.pushVisynView('vis', () => import('./views/VisVisynView').then((m) => m.visConfiguration), {
        visynViewType: 'data',
        name: 'Vis',
        factory: 'visConfiguration',
        idtype: 'ordino_public.tissue.tdp_tissue',
        selection: 'multiple',
        group: {
            name: 'Vis',
            order: 0,
        },
        description: 'Shows all information from the database for the searched genes',
        topics: ['tcga', 'information'],
    });
    registry.pushVisynView('vis', () => import('./views/VisVisynView').then((m) => m.visConfiguration), {
        visynViewType: 'data',
        name: 'Vis',
        factory: 'visConfiguration',
        idtype: 'ordino_public.public.tdp_gene',
        selection: 'multiple',
        group: {
            name: 'Vis',
            order: 0,
        },
        description: 'Shows all information from the database for the searched genes',
        topics: ['tcga', 'information'],
    });
    // generator-phovea:end
}
//# sourceMappingURL=phovea.js.map