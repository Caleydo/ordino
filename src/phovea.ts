/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
import {IRegistry, asResource} from 'phovea_core/src/plugin';
import parseRange from 'phovea_core/src/range/parser';
import ActionNode from 'phovea_core/src/provenance/ActionNode';
import {ILocaleEPDesc, EP_PHOVEA_CORE_LOCALE} from 'phovea_core/src/extensions';

export default function (registry: IRegistry) {
  //registry.push('extension-type', 'extension-id', function() { return import('./extension_impl'); }, {});
  // generator-phovea:begin

  registry.push('actionFunction', 'targidCreateView', () => System.import('./internal/cmds'), {
    factory: 'createViewImpl',
    analytics: {
      category: 'view',
      action: 'create'
    }
  });

  registry.push('actionFunction', 'targidRemoveView', () => System.import('./internal/cmds'), {
    factory: 'removeViewImpl',
    analytics: {
      category: 'view',
      action: 'remove'
    }
  });

  registry.push('actionFunction', 'targidReplaceView', () => System.import('./internal/cmds'), {
    factory: 'replaceViewImpl',
    analytics: {
      category: 'view',
      action: 'replace'
    }
  });

  registry.push('actionFunction', 'targidSetSelection', () => System.import('./internal/cmds'), {
    factory: 'setSelectionImpl',
    analytics: {
      category: 'view',
      action: 'setSelection',
      value: (node: ActionNode) => parseRange(node.parameter.range).dim(0).length // retrieve the number of selected items
    }
  });

  registry.push('actionCompressor', 'targidCreateRemoveCompressor', () => System.import('./internal/cmds'), {
    factory: 'compressCreateRemove',
    matches: '(targidCreateView|targidRemoveView|targidReplaceView)'
  });

  registry.push('actionCompressor', 'targidCompressSetSelection', () => System.import('./internal/cmds'), {
    factory: 'compressSetSelection',
    matches: '(targidSetSelection)'
  });

  registry.push('ordinoStartMenuSection', 'targid_temporary_session', () => System.import('./menu/internal/TemporarySessionSection'), {
    name: 'Temporary Sessions',
    cssClass: 'tdpSessionTemporaryData',
    priority: 90
  });

  registry.push('ordinoStartMenuSection', 'targid_persistent_session', () => System.import('./menu/internal/PersistentSessionSection'), {
    name: 'Persistent Sessions',
    cssClass: 'tdpSessionPersistentData',
    priority: 95
  });

  registry.push('ordinoWelcomeView', 'ordinoWelcomeView', () => System.import('./WelcomeView'), {
    priority: 10
  });

  registry.push(EP_PHOVEA_CORE_LOCALE, 'ordinoLocaleEN', function () {
    return System.import('./assets/locales/en/tdp.json').then(asResource);
  }, <ILocaleEPDesc>{
    order: 1,
    ns: 'tdp',
  });
  // generator-phovea:end

}
