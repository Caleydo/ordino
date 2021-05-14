/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
import { PluginRegistry } from 'phovea_core';
import { ParseRangeUtils } from 'phovea_core';
import { EP_PHOVEA_CORE_LOCALE } from 'phovea_core';
import { EP_ORDINO_STARTMENU_SESSION_SECTION, EP_ORDINO_START_MENU_TAB } from '.';
import { EStartMenuSection } from './internal';
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
    registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_current_session', () => import('./internal/components/session/CurrentSessionCard'), {
        name: 'Current Session',
        faIcon: 'fa-history',
        priority: 10
    });
    registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_temporary_session', () => import('./internal/components/session/TemporarySessionCard'), {
        name: 'Temporary Sessions',
        faIcon: 'fa-history',
        priority: 95
    });
    registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_persistent_session', () => import('./internal/components/session/SavedSessionCard'), {
        name: 'Saved Sessions',
        faIcon: 'fa-cloud',
        priority: 90
    });
    registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_import_session', () => import('./internal/components/session/UploadSessionCard'), {
        name: 'Import Session',
        faIcon: 'fa-file-upload',
        priority: 100
    });
    registry.push(EP_ORDINO_START_MENU_TAB, 'ordino_dataset_tab', () => import('./internal/menu/tabs/DatasetsTab'), {
        text: 'Datasets',
        menu: EStartMenuSection.MAIN,
        priority: 10
    });
    registry.push(EP_ORDINO_START_MENU_TAB, 'ordino_sessions_tab', () => import('./internal/menu/tabs/SessionsTab'), {
        text: 'Analysis Sessions',
        menu: EStartMenuSection.MAIN,
        priority: 20
    });
    registry.push(EP_ORDINO_START_MENU_TAB, 'ordino_tours_tab', () => import('./internal/menu/tabs/ToursTab'), {
        text: 'Tours',
        menu: EStartMenuSection.MAIN,
        priority: 30
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