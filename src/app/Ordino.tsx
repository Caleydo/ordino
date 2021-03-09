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
import {OrdinoAppComponent} from '../internal/OrdinoAppComponent';
import {TDPApplicationUtils} from 'tdp_core';
import {ATDPApplication, ITDPOptions} from 'tdp_core';
import {EStartMenuMode, EStartMenuOpen} from '../internal/menu/StartMenuReact';

export class Ordino extends ATDPApplication<OrdinoAppComponent> {

  constructor(options: Partial<ITDPOptions> = {}) {
    super(Object.assign({
      prefix: 'ordino',
      name: 'Ordino'
    }, options));
  }

  protected createApp(
    graph: ProvenanceGraph,
    manager: CLUEGraphManager,
    main: HTMLElement
  ) {
    return new Promise<OrdinoAppComponent>(async (resolve) => {
      main.classList.add('targid');

      ReactDOM.render(
        <OrdinoAppComponent
          header={this.header}
          graph={graph}
          graphManager={manager}
          ref={(instance) => {
            resolve(instance); // Promise is resolved when the component is intialized
          }}
        />,
        main
      );
    });
  }

  protected initSessionImpl(app: OrdinoAppComponent) {
    app.initApp().then(() => {
      // if (!app.graph.isEmpty) {
      //   //just if no other option applies jump to the stored state
      //   this.jumpToStoredOrLastState();
      // } else {
      //   app.initEmptySession();
      // }

      const hasInitScript = UserSession.getInstance().has(SESSION_KEY_NEW_ENTRY_POINT);

      if (app.props.graph.isEmpty && !hasInitScript) {
        app.setStartMenuState(EStartMenuOpen.OPEN, EStartMenuMode.START);

      } else if (hasInitScript) {
        app.setStartMenuState(EStartMenuOpen.CLOSED, EStartMenuMode.OVERLAY);

        const {view, options, defaultSessionValues} = UserSession.getInstance().retrieve(SESSION_KEY_NEW_ENTRY_POINT);

        if (defaultSessionValues && Object.keys(defaultSessionValues).length > 0) {
          app.props.graph.push(TDPApplicationUtils.initSession(defaultSessionValues));
        }
        app.push(view, null, null, options);
        UserSession.getInstance().remove(SESSION_KEY_NEW_ENTRY_POINT);
      } else {
        app.setStartMenuState(EStartMenuOpen.CLOSED, EStartMenuMode.OVERLAY);
        //just if no other option applies jump to the stored state
        this.jumpToStoredOrLastState();
      }
    });
  }

}
