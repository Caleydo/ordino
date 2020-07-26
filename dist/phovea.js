/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
import { PluginRegistry } from 'phovea_core';
import { ParseRangeUtils } from 'phovea_core';
import { EP_PHOVEA_CORE_LOCALE } from 'phovea_core';
export default function (registry) {
    //registry.push('extension-type', 'extension-id', function() { return import('./extension_impl'); }, {});
    // generator-phovea:begin
    registry.push('actionFunction', 'targidCreateView', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'createViewImpl',
        analytics: {
            category: 'view',
            action: 'create'
        }
    });
    registry.push('actionFunction', 'targidRemoveView', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'removeViewImpl',
        analytics: {
            category: 'view',
            action: 'remove'
        }
    });
    registry.push('actionFunction', 'targidReplaceView', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'replaceViewImpl',
        analytics: {
            category: 'view',
            action: 'replace'
        }
    });
    registry.push('actionFunction', 'targidSetSelection', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'setSelectionImpl',
        analytics: {
            category: 'view',
            action: 'setSelection',
            value: (node) => ParseRangeUtils.parseRangeLike(node.parameter.range).dim(0).length // retrieve the number of selected items
        }
    });
    registry.push('actionCompressor', 'targidCreateRemoveCompressor', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'compressCreateRemove',
        matches: '(targidCreateView|targidRemoveView|targidReplaceView)'
    });
    registry.push('actionCompressor', 'targidCompressSetSelection', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'compressSetSelection',
        matches: '(targidSetSelection)'
    });
    registry.push('ordinoStartMenuSection', 'targid_temporary_session', () => import('./menu/internal/TemporarySessionSection'), {
        factory: 'new TemporarySessionSection',
        name: 'Temporary Sessions',
        cssClass: 'tdpSessionTemporaryData',
        priority: 90
    });
    registry.push('ordinoStartMenuSection', 'targid_persistent_session', () => import('./menu/internal/PersistentSessionSection'), {
        factory: 'new PersistentSessionSection',
        name: 'Persistent Sessions',
        cssClass: 'tdpSessionPersistentData',
        priority: 95
    });
    registry.push('ordinoWelcomeView', 'ordinoWelcomeView', () => import('./base/WelcomeView'), {
        factory: 'new WelcomeView',
        priority: 10
    });
    registry.push(EP_PHOVEA_CORE_LOCALE, 'ordinoLocaleEN', function () {
        return import('./locales/en/tdp.json').then(PluginRegistry.getInstance().asResource);
    }, {
        order: 1,
        ns: 'tdp',
    });
    // generator-phovea:end
}
//# sourceMappingURL=phovea.js.map