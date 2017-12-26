/**
 * Created by sam on 03.03.2017.
 */

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
import StartMenu from 'ordino/src/internal/StartMenu';

export {ITDPOptions as IOrdinoOptions, CLUEGraphManager} from 'tdp_core/src/ATDPApplication';

export default class Ordino extends ATDPApplication<OrdinoApp> {

  constructor(options: Partial<ITDPOptions> = {}) {
    super(Object.assign({
      prefix: 'ordino',
      name: 'Ordino'
    }, options));
  }

  protected createApp(graph: ProvenanceGraph, manager: CLUEGraphManager, main: HTMLElement) {
    main.classList.add('targid');
    const startMenuNode = main.ownerDocument.createElement('div');
    startMenuNode.classList.add('startMenu');
    main.appendChild(startMenuNode);

    // lazy loading
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
      this.fire(Ordino.EVENT_OPEN_START_MENU);
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
}
