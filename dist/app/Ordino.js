/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { OrdinoApp } from '../internal/OrdinoApp';
import { ATDPApplication } from 'tdp_core';
import { EStartMenuMode, EStartMenuOpen } from '../internal/menu/StartMenu';
export class Ordino extends ATDPApplication {
    constructor(options = {}) {
        super(Object.assign({
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
            showProvenanceMenu: false
        }, options));
    }
    createApp(graph, manager, main) {
        return new Promise(async (resolve) => {
            main.classList.add('targid');
            // open home page
            const appLink = document.querySelector('*[data-header="appLink"]');
            appLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.open('/#/');
            });
            ReactDOM.render(React.createElement(OrdinoApp, { header: this.header, graph: graph, graphManager: manager, ref: (instance) => {
                    resolve(instance); // Promise is resolved when the component is intialized
                } }), main);
        });
    }
    initSessionImpl(app) {
        app.initApp().then(() => {
            if (app.props.graph.isEmpty) {
                app.initNewSessionAfterPageReload();
            }
            else {
                //just if no other option applies jump to the stored state
                app.setStartMenuState(EStartMenuOpen.CLOSED, EStartMenuMode.OVERLAY);
                this.jumpToStoredOrLastState();
            }
        });
    }
}
//# sourceMappingURL=Ordino.js.map