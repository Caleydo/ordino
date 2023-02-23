/** ******************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ******************************************************************* */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextManager } from 'visyn_core/i18n';
import { ProvenanceGraph, CLUEGraphManager, ATDPApplication, ITDPOptions } from 'tdp_core';

// eslint-disable-next-line import/no-cycle
import { OrdinoApp } from '../internal/OrdinoApp';
import { EStartMenuMode, EStartMenuOpen } from '../internal/constants';

export class Ordino extends ATDPApplication<OrdinoApp> {
  constructor(options: Partial<ITDPOptions> = {}) {
    super({
      prefix: 'ordino',
      name: 'Ordino',
      /**
       * Show content in the `Ordino at a Glance` page instead
       */
      showAboutLink: false,
      /**
       * Show content in the `Ordino at a Glance` page instead
       */
      showReportBugLink: false,
      /**
       * Hide help and show help in `Ordino at a Glance` page instead
       */
      showHelpLink: false,
      /**
       * Hide tours link and show tours in a separate tours tab instead
       */
      showTourLink: false,
      /**
       * Functionality is included in the sessions tab
       */
      showProvenanceMenu: false,
      ...options,
    });
  }

  protected createApp(graph: ProvenanceGraph, manager: CLUEGraphManager, main: HTMLElement) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<OrdinoApp>(async (resolve) => {
      main.classList.add('targid');

      // reconfigure app link to open the homepage in a new tab
      const appLink = document.querySelector('*[data-header="appLink"]') as HTMLAnchorElement;
      appLink.title = I18nextManager.getInstance().i18n.t('tdp:ordino.appLink.title');
      appLink.href = '/'; // domain root
      appLink.target = '_blank';
      appLink.rel = 'noopener noreferrer';
      appLink.onclick = null; // remove default click listener from `ATDPApplication.createHeader()`

      ReactDOM.render(
        <OrdinoApp
          header={this.header}
          graph={graph}
          graphManager={manager}
          ref={(instance) => {
            resolve(instance); // Promise is resolved when the component is intialized
          }}
        />,
        main,
      );
    });
  }

  protected async initSessionImpl(app: OrdinoApp) {
    await app.initApp();

    if (app.props.graph.isEmpty) {
      await app.initNewSessionAfterPageReload();
    } else {
      // just if no other option applies jump to the stored state
      app.setStartMenuState(EStartMenuOpen.CLOSED, EStartMenuMode.OVERLAY);
      await this.jumpToStoredOrLastState();
    }
  }
}
