/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { UserSession } from 'phovea_core';
import { SESSION_KEY_NEW_ENTRY_POINT } from '../internal/constants';
import { OrdinoAppComponent } from '../internal/OrdinoAppComponent';
import { TDPApplicationUtils } from 'tdp_core';
import { ATDPApplication } from 'tdp_core';
import { EStartMenuMode } from '../internal/menu/StartMenuReact';
export class Ordino extends ATDPApplication {
    constructor(options = {}) {
        super(Object.assign({
            prefix: 'ordino',
            name: 'Ordino'
        }, options));
    }
    createApp(graph, manager, main) {
        return new Promise(async (resolve) => {
            main.classList.add('targid');
            ReactDOM.render(React.createElement(OrdinoAppComponent, { header: this.header, graph: graph, graphManager: manager, ref: (instance) => {
                    resolve(instance); // Promise is resolved when the component is intialized
                } }), main);
        });
    }
    initSessionImpl(app) {
        app.initApp().then(() => {
            // if (!app.graph.isEmpty) {
            //   //just if no other option applies jump to the stored state
            //   this.jumpToStoredOrLastState();
            // } else {
            //   app.initEmptySession();
            // }
            const hasInitScript = UserSession.getInstance().has(SESSION_KEY_NEW_ENTRY_POINT);
            if (app.props.graph.isEmpty && !hasInitScript) {
                app.setStartMenuMode(EStartMenuMode.START);
            }
            else if (hasInitScript) {
                app.setStartMenuMode(EStartMenuMode.OVERLAY);
                const { view, options, defaultSessionValues } = UserSession.getInstance().retrieve(SESSION_KEY_NEW_ENTRY_POINT);
                if (defaultSessionValues && Object.keys(defaultSessionValues).length > 0) {
                    app.props.graph.push(TDPApplicationUtils.initSession(defaultSessionValues));
                }
                app.push(view, null, null, options);
                UserSession.getInstance().remove(SESSION_KEY_NEW_ENTRY_POINT);
            }
            else {
                app.setStartMenuMode(EStartMenuMode.OVERLAY);
                //just if no other option applies jump to the stored state
                this.jumpToStoredOrLastState();
            }
        });
    }
}
//# sourceMappingURL=Ordino.js.map