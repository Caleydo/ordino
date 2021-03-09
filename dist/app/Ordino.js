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
import { TDPApplicationUtils } from 'tdp_core';
import { ATDPApplication } from 'tdp_core';
export class Ordino extends ATDPApplication {
    constructor(options = {}) {
        super(Object.assign({
            prefix: 'ordino',
            name: 'Ordino'
        }, options));
        this.modeResolver = null;
    }
    async createApp(graph, manager, main) {
        main.classList.add('targid');
        // lazy loading for better module bundling
        const modules = await Promise.all([import('../internal/OrdinoApp'), import('../internal/menu/StartMenuReact')]);
        const app = new modules[0].OrdinoApp(graph, manager, main);
        const modePromise = new Promise((resolve, reject) => {
            this.modeResolver = resolve;
        });
        const startMenuElement = main.ownerDocument.createElement('div');
        main.parentElement.append(startMenuElement); // append element before ReactDOM.render()
        const renderStartMenu = () => ReactDOM.render(React.createElement(modules[1].StartMenuComponent, { header: this.header, app, modePromise, options: this.options }), startMenuElement);
        renderStartMenu();
        // app.on(ViewUtils.VIEW_EVENT_UPDATE_ENTRY_POINT, (event: IEvent, namedSet: INamedSet) => startMenu.pushNamedSet(namedSet));
        return app;
    }
    initSessionImpl(app) {
        console.log('init session');
        const hasInitScript = UserSession.getInstance().has(SESSION_KEY_NEW_ENTRY_POINT);
        if (app.graph.isEmpty && !hasInitScript) {
            this.modeResolver('start');
        }
        else if (hasInitScript) {
            this.modeResolver('overlay');
            const { view, options, defaultSessionValues } = UserSession.getInstance().retrieve(SESSION_KEY_NEW_ENTRY_POINT);
            if (defaultSessionValues && Object.keys(defaultSessionValues).length > 0) {
                app.graph.push(TDPApplicationUtils.initSession(defaultSessionValues));
            }
            app.push(view, null, null, options);
            UserSession.getInstance().remove(SESSION_KEY_NEW_ENTRY_POINT);
        }
        else {
            this.modeResolver('overlay');
            //just if no other option applies jump to the stored state
            this.jumpToStoredOrLastState();
        }
    }
}
//# sourceMappingURL=Ordino.js.map