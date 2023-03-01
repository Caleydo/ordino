import { ActionNode, EXTENSION_POINT_CUSTOMIZED_LOGIN_FORM } from 'tdp_core';
import { PluginRegistry, EP_PHOVEA_CORE_LOCALE, ILocaleEPDesc } from 'visyn_core/plugin';
import type { IRegistry } from 'visyn_core/plugin';
import { EP_ORDINO_STARTMENU_SESSION_SECTION, EP_ORDINO_LOGO, IOrdinoLogoDesc } from './index';

export default function (registry: IRegistry) {
  // registry.push('extension-type', 'extension-id', function() { return import('./extension_impl'); }, {});
  // generator-phovea:begin

  registry.push('actionFunction', 'targidCreateView', () => import('./internal/cmds.js').then((c) => c.CmdUtils), {
    factory: 'createViewImpl',
    analytics: {
      category: 'view',
      action: 'create',
    },
  });

  registry.push('actionFunction', 'targidRemoveView', () => import('./internal/cmds.js').then((c) => c.CmdUtils), {
    factory: 'removeViewImpl',
    analytics: {
      category: 'view',
      action: 'remove',
    },
  });

  registry.push('actionFunction', 'targidReplaceView', () => import('./internal/cmds.js').then((c) => c.CmdUtils), {
    factory: 'replaceViewImpl',
    analytics: {
      category: 'view',
      action: 'replace',
    },
  });

  registry.push('actionFunction', 'targidSetSelection', () => import('./internal/cmds.js').then((c) => c.CmdUtils), {
    factory: 'setSelectionImpl',
    analytics: {
      category: 'view',
      action: 'setSelection',
      value: (node: ActionNode) => node.parameter.selection?.length || 0,
    },
  });

  registry.push('actionCompressor', 'targidCreateRemoveCompressor', () => import('./internal/cmds.js').then((c) => c.CmdUtils), {
    factory: 'compressCreateRemove',
    matches: '(targidCreateView|targidRemoveView|targidReplaceView)',
  });

  registry.push('actionCompressor', 'targidCompressSetSelection', () => import('./internal/cmds.js').then((c) => c.CmdUtils), {
    factory: 'compressSetSelection',
    matches: '(targidSetSelection)',
  });

  registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_current_session', () => import('./internal/components/session/CurrentSessionCard.js'), {
    name: 'Current Session',
    faIcon: 'fa-history',
    priority: 10,
  });

  registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_temporary_session', () => import('./internal/components/session/TemporarySessionCard.js'), {
    name: 'Temporary Sessions',
    faIcon: 'fa-history',
    priority: 95,
  });

  registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_persistent_session', () => import('./internal/components/session/SavedSessionCard.js'), {
    name: 'Saved Sessions',
    faIcon: 'fa-cloud',
    priority: 90,
  });

  registry.push(EP_ORDINO_STARTMENU_SESSION_SECTION, 'targid_import_session', () => import('./internal/components/session/UploadSessionCard.js'), {
    name: 'Import Session',
    faIcon: 'fa-file-upload',
    priority: 100,
  });

  registry.push(EP_ORDINO_LOGO, 'ordino_logo', () => import('./assets/logos/ordino.svg').then(PluginRegistry.getInstance().asResource), <IOrdinoLogoDesc>{
    text: 'Ordino',
    width: 30,
    height: 30,
  });

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

  // customized login dialog
  if (process.env.ENABLE_COOKIE_STORE != null && JSON.parse(process.env.ENABLE_COOKIE_STORE) === true) {
    registry.push(
      EXTENSION_POINT_CUSTOMIZED_LOGIN_FORM,
      'ordino_api_cookie_store_login',
      () => import('./internal/components/login/SecurityCookieStoreLoginDialog.js'),
      {},
    );
  }
  // generator-phovea:end
}
