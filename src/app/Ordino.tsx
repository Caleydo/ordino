/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ProvenanceGraph, I18nextManager} from 'phovea_core';
import {CLUEGraphManager} from 'phovea_clue';
import {ATDPApplication} from 'tdp_core';
import {OrdinoComponent} from './OrdinoComponent';

export interface IOrdinoInstance {
  initApp(): Promise<void>;
  initEmptySession(): Promise<void>;
}

export class Ordino extends ATDPApplication<IOrdinoInstance> {
  protected createApp(
    graph: ProvenanceGraph,
    manager: CLUEGraphManager,
    main: HTMLElement
  ) {
    document.title = 'Ordino';

    // TODO remove
    document.querySelector('.phovea-navbar').setAttribute('hidden', '');
    document.querySelectorAll('.content > aside').forEach((node) => node.setAttribute('hidden', ''));

    return new Promise<IOrdinoInstance>(async (resolve) => {
      ReactDOM.render(
        <OrdinoComponent
          onCreated={(instance) => {
            resolve(instance);
          }}
        />,
        main
      );
    });
  }

  protected async initSessionImpl(app: IOrdinoInstance) {
    await app.initApp();
    await app.initEmptySession();
  }
}
