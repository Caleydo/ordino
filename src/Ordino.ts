/**
 * Created by sam on 03.03.2017.
 */

import ProvenanceGraph from 'phovea_core/src/provenance/ProvenanceGraph';
import {IEvent} from 'phovea_core/src/event';
import IDType from 'phovea_core/src/idtype/IDType';
import * as session from 'phovea_core/src/session';
import {AView} from 'tdp_core/src/views';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {StartMenu} from './StartMenu';
import {INamedSet} from 'tdp_core/src/storage';
import TargidConstants from './constants';
import Targid from './Targid';
import {initSession} from 'tdp_core/src/cmds';
import ATDPApplication, {ITDPOptions} from 'tdp_core/src/ATDPApplication';

export {ITDPOptions as IOrdinoOptions, CLUEGraphManager} from 'tdp_core/src/ATDPApplication';

export default class Ordino extends ATDPApplication<Targid> {

  constructor(options: Partial<ITDPOptions> = {}) {
    super(Object.assign({
      prefix: 'ordino',
      name: 'Ordino'
    }, options));
  }

  protected createApp(graph: ProvenanceGraph, manager: CLUEGraphManager, main: HTMLElement) {
    main.classList.add('targid');
    const targid = new Targid(graph, manager, main);

    const startMenuNode = main.ownerDocument.createElement('div');
    main.appendChild(startMenuNode);
    startMenuNode.classList.add('startMenu');
    const startMenu = new StartMenu(startMenuNode, {targid});

    this.on(Ordino.EVENT_OPEN_START_MENU, () => startMenu.open());
    targid.on(Ordino.EVENT_OPEN_START_MENU, () => startMenu.open());
    targid.on(AView.EVENT_UPDATE_ENTRY_POINT, (event: IEvent, idtype: IDType | string, namedSet: INamedSet) => startMenu.updateEntryPointList(idtype, namedSet));
    return targid;
  }

  protected initSessionImpl(targid: Targid) {
    const hasInitScript = session.has(TargidConstants.NEW_ENTRY_POINT);
    const graph = targid.graph;
    if (graph.isEmpty && !hasInitScript) {
      this.fire(Ordino.EVENT_OPEN_START_MENU);
    } else if (hasInitScript) {
      const {view, options, defaultSessionValues} = <any>session.retrieve(TargidConstants.NEW_ENTRY_POINT);

      if (defaultSessionValues && Object.keys(defaultSessionValues).length > 0) {
        graph.push(initSession(defaultSessionValues));
      }
      targid.push(view, null, null, options);
      session.remove(TargidConstants.NEW_ENTRY_POINT);
    } else {
      //just if no other option applies jump to the stored state
      this.jumpToStoredOrLastState();
    }
  }
}
