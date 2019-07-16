/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/


import ProvenanceGraph from 'phovea_core/src/provenance/ProvenanceGraph';
import {IEvent} from 'phovea_core/src/event';
import * as session from 'phovea_core/src/session';
import {VIEW_EVENT_UPDATE_ENTRY_POINT} from 'tdp_core/src/views/interfaces';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {INamedSet} from 'tdp_core/src/storage';
import {SESSION_KEY_NEW_ENTRY_POINT} from './internal/constants';
import OrdinoApp from './internal/OrdinoApp';
import {initSession} from 'tdp_core/src/cmds';
import ATDPApplication, {ITDPOptions} from 'tdp_core/src/ATDPApplication';
import StartMenu from './internal/StartMenu';
import {trackApp, ITrackableAction} from 'tdp_matomo/src/matomo';
import parseRange from 'phovea_core/src/range/parser';

export {ITDPOptions as IOrdinoOptions, CLUEGraphManager} from 'tdp_core/src/ATDPApplication';

export default class Ordino extends ATDPApplication<OrdinoApp> {

  constructor(options: Partial<ITDPOptions> = {}) {
    super(Object.assign({
      prefix: 'ordino',
      name: 'Ordino'
    }, options));

    this.matomoTracking(); // enable matomo tracking before createApp()
  }

  protected createApp(graph: ProvenanceGraph, manager: CLUEGraphManager, main: HTMLElement) {
    main.classList.add('targid');
    const startMenuNode = main.ownerDocument.createElement('div');
    startMenuNode.classList.add('startMenu');
    main.appendChild(startMenuNode);

    // lazy loading for better module bundling
    return Promise.all([System.import('./internal/OrdinoApp'), System.import('./internal/StartMenu')]).then((modules) => {
      const app: OrdinoApp = new modules[0].default(graph, manager, main);

      const startMenu: StartMenu = new modules[1].default(startMenuNode, app);

      this.on(Ordino.EVENT_OPEN_START_MENU, () => startMenu.open());
      app.on(Ordino.EVENT_OPEN_START_MENU, () => startMenu.open());
      app.on(VIEW_EVENT_UPDATE_ENTRY_POINT, (event: IEvent, namedSet: INamedSet) => startMenu.pushNamedSet(namedSet));
      return app;
    });
  }

  protected initSessionImpl(app: OrdinoApp) {
    const hasInitScript = session.has(SESSION_KEY_NEW_ENTRY_POINT);
    const graph = app.graph;
    if (graph.isEmpty && !hasInitScript) {
      const hasSeenWelcomePage = `${this.options.prefix}_has_seen_welcome_page`;
      // open start menu only if the user has the welcome page once
      if (localStorage.getItem(hasSeenWelcomePage) === '1') {
        this.fire(Ordino.EVENT_OPEN_START_MENU);
      } else {
        localStorage.setItem(hasSeenWelcomePage, '1');
      }
    } else if (hasInitScript) {
      const {view, options, defaultSessionValues} = <any>session.retrieve(SESSION_KEY_NEW_ENTRY_POINT);

      if (defaultSessionValues && Object.keys(defaultSessionValues).length > 0) {
        graph.push(initSession(defaultSessionValues));
      }
      app.push(view, null, null, options);
      session.remove(SESSION_KEY_NEW_ENTRY_POINT);
    } else {
      //just if no other option applies jump to the stored state
      this.jumpToStoredOrLastState();
    }
  }

  /**
   * Track actions (from the provenance graph) using Matomo from `tdp_matomo`.
   * See documentation of `tdp_matomo` for further configuration.
   *
   * Note: Requires a valid URL + site id to a Matomo backend in the config.json!
   * The tracking is disabled (even though this function is called)
   * until a valid URL is set in the config.json.
   */
  protected matomoTracking() {
    // add ordino specific actions
    const trackableActions: ITrackableAction[] = [
      // id = phovea extension id
      {id: 'targidCreateView', event: {category:'view', action: 'create'}},
      {id: 'targidRemoveView', event: {category:'view', action: 'remove'}},
      {id: 'targidReplaceView', event: {category:'view', action: 'replace'}},
      {id: 'targidSetSelection', event: {category:'view', action: 'setSelection', value: (node) => parseRange(node.parameter.range).dim(0).length}},
    ];

    trackApp(this, trackableActions);
  }
}
