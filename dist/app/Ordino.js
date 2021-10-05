/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ATDPApplication } from 'tdp_core';
import { OrdinoComponent } from './OrdinoComponent';
export class Ordino extends ATDPApplication {
    createApp(graph, manager, main) {
        document.title = 'Ordino';
        // TODO remove
        document.querySelector('.phovea-navbar').setAttribute('hidden', '');
        document.querySelectorAll('.content > aside').forEach((node) => node.setAttribute('hidden', ''));
        return new Promise(async (resolve) => {
            ReactDOM.render(React.createElement(OrdinoComponent, { onCreated: (instance) => {
                    resolve(instance);
                } }), main);
        });
    }
    async initSessionImpl(app) {
        await app.initApp();
        await app.initEmptySession();
    }
}
//# sourceMappingURL=Ordino.js.map