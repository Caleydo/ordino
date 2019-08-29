/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
import {IRegistry} from 'phovea_core/src/plugin';

export default function (registry: IRegistry) {
  //registry.push('extension-type', 'extension-id', function() { return import('./extension_impl'); }, {});
  // generator-phovea:begin

  registry.push('actionFunction', 'targidCreateView', () => System.import('./internal/cmds'), {
    factory: 'createViewImpl'
  });

  registry.push('actionFunction', 'targidRemoveView', () => System.import('./internal/cmds'), {
    factory: 'removeViewImpl'
  });

  registry.push('actionFunction', 'targidReplaceView', () => System.import('./internal/cmds'), {
    factory: 'replaceViewImpl'
  });

  registry.push('actionFunction', 'targidSetSelection', () => System.import('./internal/cmds'), {
    factory: 'setSelectionImpl'
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
  // generator-phovea:end

}
