/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
import { PluginRegistry, EP_PHOVEA_CORE_LOCALE, EXTENSION_POINT_CUSTOMIZED_LOGIN_FORM } from 'tdp_core';
import { EP_ORDINO_STARTMENU_SESSION_SECTION } from './base/extensions';
import { EP_ORDINO_LOGO } from './base';
export default function (registry) {
    // registry.push('extension-type', 'extension-id', function() { return import('./extension_impl'); }, {});
    // generator-phovea:begin
    registry.push('actionFunction', 'targidCreateView', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'createViewImpl',
        analytics: {
            category: 'view',
            action: 'create',
        },
    });
    registry.push('actionFunction', 'targidRemoveView', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'removeViewImpl',
        analytics: {
            category: 'view',
            action: 'remove',
        },
    });
    registry.push('actionFunction', 'targidReplaceView', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'replaceViewImpl',
        analytics: {
            category: 'view',
            action: 'replace',
        },
    });
    registry.push('actionFunction', 'targidSetSelection', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'setSelectionImpl',
        analytics: {
            category: 'view',
            action: 'setSelection',
            value: (node) => { var _a; return ((_a = node.parameter.selection) === null || _a === void 0 ? void 0 : _a.length) || 0; },
        },
    });
    registry.push('actionCompressor', 'targidCreateRemoveCompressor', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'compressCreateRemove',
        matches: '(targidCreateView|targidRemoveView|targidReplaceView)',
    });
    registry.push('actionCompressor', 'targidCompressSetSelection', () => import('./internal/cmds').then((c) => c.CmdUtils), {
        factory: 'compressSetSelection',
        matches: '(targidSetSelection)',
    });
    registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_current_session', () => import('./internal/components/session/CurrentSessionCard'), {
        name: 'Current Session',
        faIcon: 'fa-history',
        priority: 10,
    });
    registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_temporary_session', () => import('./internal/components/session/TemporarySessionCard'), {
        name: 'Temporary Sessions',
        faIcon: 'fa-history',
        priority: 95,
    });
    registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_persistent_session', () => import('./internal/components/session/SavedSessionCard'), {
        name: 'Saved Sessions',
        faIcon: 'fa-cloud',
        priority: 90,
    });
    registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_import_session', () => import('./internal/components/session/UploadSessionCard'), {
        name: 'Import Session',
        faIcon: 'fa-file-upload',
        priority: 100,
    });
    registry.push(EP_ORDINO_LOGO, 'ordino_logo', () => import('ordino/dist/assets/logos/ordino.svg').then(PluginRegistry.getInstance().asResource), {
        text: 'Ordino',
        width: 30,
        height: 30,
    });
    registry.push(EP_PHOVEA_CORE_LOCALE, 'ordinoLocaleEN', function () {
        return import('./locales/en/tdp.json').then(PluginRegistry.getInstance().asResource);
    }, {
        order: 1,
        ns: 'tdp',
    });
    // customized login dialog
    if (process.env.ENABLE_COOKIE_STORE != null && JSON.parse(process.env.ENABLE_COOKIE_STORE) === true) {
        registry.push(EXTENSION_POINT_CUSTOMIZED_LOGIN_FORM, 'ordino_api_cookie_store_login', () => import('./internal/components/login/SecurityCookieStoreLoginDialog'), {});
    }
    // generator-phovea:end
}
//# sourceMappingURL=phovea.js.map