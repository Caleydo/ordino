/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
import {EXTENSION_POINT_VISYN_VIEW, EXTENSION_POINT_TDP_VIEW, IRegistry, PluginRegistry, Vis} from 'tdp_core';
import {EP_ORDINO_LOGO, IOrdinoLogoDesc} from './base';
import {VisVisynView} from './views/VisVisynView';

export default function (registry: IRegistry) {
  //registry.push('extension-type', 'extension-id', function() { return import('./extension_impl'); }, {});
  // generator-phovea:begin
  registry.push(EP_ORDINO_LOGO, 'ordino_logo', () => import('tdp_core/dist/assets/icons/datavisyn_logo_blue_white.svg').then(PluginRegistry.getInstance().asResource), <IOrdinoLogoDesc>{
    text: 'Ordino',
    width: 24,
    height: 24
  });

  registry.pushVisynView('cosmic', function () {
    return import('./views/CosmicProxyView');
  }, {
    factory: 'cosmicConfiguration',
    name: 'COSMIC',
    site: 'https://cancer.sanger.ac.uk/cell_lines/sample/overview?id={cosmicid}&genome=38',
    argument: 'cosmicid',
    idtype: 'ordino_public.cellline.tdp_cellline',
    selection: 'chooser',
    group: {
      name: 'External Resources',
      order: 0
    },
    filter: {
      species: 'human'
    },
    description: 'Show information on your search from COSMIC',
    topics: ['cellline', 'external']
  });

  registry.pushVisynView('vis', function () {
    return import('./views/VisVisynView');
  }, {
    name: 'Vis',
    factory: 'visConfiguration',
    idtype: 'ordino_public.cellline.tdp_cellline',
    selection: 'multiple',
    group: {
      name: 'Vis',
      order: 0
    },
    description: 'Shows all information from the database for the searched genes',
    topics: ['tcga', 'information']
  });

  registry.pushVisynView('vis', function () {
    return import('./views/VisVisynView');
  }, {
    name: 'Vis',
    factory: 'visConfiguration',
    idtype: 'ordino_public.tissue.tdp_tissue',
    selection: 'multiple',
    group: {
      name: 'Vis',
      order: 0
    },
    description: 'Shows all information from the database for the searched genes',
    topics: ['tcga', 'information']
  });

  registry.pushVisynView('vis', function () {
    return import('./views/VisVisynView');
  }, {
    name: 'Vis',
    factory: 'visConfiguration',
    idtype: 'ordino_public.public.tdp_gene',
    selection: 'multiple',
    group: {
      name: 'Vis',
      order: 0
    },
    description: 'Shows all information from the database for the searched genes',
    topics: ['tcga', 'information']
  });

  // generator-phovea:end
}


