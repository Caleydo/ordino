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
import {CLUEGraphManager} from 'phovea_clue';
import {OrdinoApp} from '../internal/OrdinoApp';
import {ATDPApplication, ITDPOptions} from 'tdp_core';
import {EStartMenuMode, EStartMenuOpen} from '../internal/menu/StartMenuReact';

export class Ordino extends ATDPApplication<OrdinoApp> {

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
    return new Promise<OrdinoApp>(async (resolve) => {
      main.classList.add('targid');

      ReactDOM.render(
        <OrdinoApp
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

  protected initSessionImpl(app: OrdinoApp) {
    app.initApp().then(() => {
      if (app.props.graph.isEmpty) {
        app.initNewSessionAfterPageReload();
      } else {
        //just if no other option applies jump to the stored state
        app.setStartMenuState(EStartMenuOpen.CLOSED, EStartMenuMode.OVERLAY);
        this.jumpToStoredOrLastState();
      }
    });
  }

}
