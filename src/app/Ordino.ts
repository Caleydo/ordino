/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ProvenanceGraph} from 'phovea_core';
import {UserSession} from 'phovea_core';
import {CLUEGraphManager} from 'phovea_clue';
import {SESSION_KEY_NEW_ENTRY_POINT} from '../internal/constants';
import {OrdinoApp} from '../internal/OrdinoApp';
import {TDPApplicationUtils} from 'tdp_core';
import {ATDPApplication, ITDPOptions} from 'tdp_core';

export class Ordino extends ATDPApplication<OrdinoApp> {

  constructor(options: Partial<ITDPOptions> = {}) {
    super(Object.assign({
      prefix: 'ordino',
      name: 'Ordino'
    }, options));
  }

  protected async createApp(graph: ProvenanceGraph, manager: CLUEGraphManager, main: HTMLElement) {
    main.classList.add('targid');

    // lazy loading for better module bundling
    const modules = await Promise.all([import('../internal/OrdinoApp'), import('../internal/menu/StartMenuReact')]);

    const app: OrdinoApp = new modules[0].OrdinoApp(graph, manager, main);

    const startMenuElement = main.ownerDocument.createElement('div');
    main.parentElement.append(startMenuElement); // append element before ReactDOM.render()
    const renderStartMenu = () => ReactDOM.render(React.createElement(modules[1].StartMenuComponent, {headerMainMenu: this.header.mainMenu, manager,graph}), startMenuElement);

    renderStartMenu();

    // this.on(Ordino.EVENT_OPEN_START_MENU, () => renderStartMenu());
    // app.on(Ordino.EVENT_OPEN_START_MENU, () => renderStartMenu());
    // app.on(ViewUtils.VIEW_EVENT_UPDATE_ENTRY_POINT, (event: IEvent, namedSet: INamedSet) => startMenu.pushNamedSet(namedSet));

    return app;
  }

  protected initSessionImpl(app: OrdinoApp) {
    const hasInitScript = UserSession.getInstance().has(SESSION_KEY_NEW_ENTRY_POINT);
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
      const {view, options, defaultSessionValues} = UserSession.getInstance().retrieve(SESSION_KEY_NEW_ENTRY_POINT);

      if (defaultSessionValues && Object.keys(defaultSessionValues).length > 0) {
        graph.push(TDPApplicationUtils.initSession(defaultSessionValues));
      }
      app.push(view, null, null, options);
      UserSession.getInstance().remove(SESSION_KEY_NEW_ENTRY_POINT);
    } else {
      //just if no other option applies jump to the stored state
      this.jumpToStoredOrLastState();
    }
  }
}
