/**
 * Created by sam on 03.03.2017.
 */

import {ProvenanceGraph} from 'phovea_core/src/provenance';
import {create as createHeader, AppHeaderLink} from 'phovea_ui/src/header';
import {IEvent} from 'phovea_core/src/event';
import {Range} from 'phovea_core/src/range';
import {IDType} from 'phovea_core/src/idtype';
import * as session from 'phovea_core/src/session';
import { AView} from './View';
import {
  MixedStorageProvenanceGraphManager,
  IProvenanceGraphDataDescription,
  SlideNode
} from 'phovea_core/src/provenance';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {StartMenu} from './StartMenu';
import {INamedSet} from './storage';
import {VerticalStoryVis} from 'phovea_clue/src/storyvis';
import {select} from 'd3';
import * as cmode from 'phovea_clue/src/mode';
import {create as createProvVis} from 'phovea_clue/src/provvis';
import LoginMenu from 'phovea_clue/src/menu/LoginMenu';
import TargidConstants from './constants';
import Targid from './Targid';
import {isLoggedIn} from 'phovea_clue/src/user';
export {default as CLUEGraphManager} from 'phovea_clue/src/CLUEGraphManager';
import ACLUEWrapper, {createStoryVis} from 'phovea_clue/src/ACLUEWrapper';

export interface IOrdinoOptions {
  loginForm?: string;
}

export default class Ordino extends ACLUEWrapper {
  private targid: Promise<Targid>;

  constructor(options: IOrdinoOptions = {}) {
    super(document.body, {replaceBody: false});

  }

  protected build(body: HTMLElement): {graph: Promise<ProvenanceGraph>, storyVis: Promise<VerticalStoryVis>, manager: CLUEGraphManager} {
    //create the common header
    const headerOptions = {
      showOptionsLink: true, // always activate options
      appLink: new AppHeaderLink('Target Discovery Platform', (event) => {
        event.preventDefault();
        this.fire('open_default');
        return false;
      })
    };
    const header = createHeader(<HTMLElement>body.querySelector('div.box'), headerOptions);
    this.on('jumped_to,loaded_graph', () => header.ready());
    //load all available provenance graphs
    const manager = new MixedStorageProvenanceGraphManager({
      prefix: 'ordino',
      storage: sessionStorage,
      application: 'ordino'
    });
    const clueManager = new CLUEGraphManager(manager);

    header.wait();

    const loginMenu = new LoginMenu(header, {
      insertIntoHeader: true
    });
    loginMenu.on('logged_out', ()=> {
      // reopen after logged out
      loginMenu.forceShowDialog();
    });

    const modeSelector = body.querySelector('header');
    modeSelector.className += 'clue-modeselector';
    cmode.createButton(modeSelector, {
      size: 'sm'
    });

    const graph = clueManager.list().then((graphs) => {
      return clueManager.choose(graphs);
    });


    const main = <HTMLElement>document.body.querySelector('main');
    main.classList.add('targid');

    graph.then((graph) => {
      graph.on('sync_start,sync', (event: IEvent) => {
        select('nav span.glyphicon-cog').classed('fa-spin', event.type !== 'sync');
      });
    });

    const storyVis = graph.then((graph) => {
      createProvVis(graph, body.querySelector('div.content'), {
        thumbnails: false,
        provVisCollapsed: true
      });
      return createStoryVis(graph, <HTMLElement>body.querySelector('div.content'), main, {
        thumbnails: false
      });
    });

    graph.then((graph) => {
      // create TargID app once the provenance graph is available
      const targid = new Targid(graph, clueManager, main);

      const startMenuNode = main.ownerDocument.createElement('div');
      startMenuNode.classList.add('startMenu');
      const startMenu = new StartMenu(startMenuNode, {targid});

      targid.on('openStartMenu', () => startMenu.open());
      targid.on(AView.EVENT_UPDATE_ENTRY_POINT, (event:IEvent, idtype: IDType | string, namedSet: INamedSet) => startMenu.updateEntryPointList(idtype, namedSet));

      const initSession = () => {
        const hasInitScript = session.has(TargidConstants.NEW_ENTRY_POINT);

        if(graph.isEmpty && !hasInitScript) {
          startMenu.open();
        } else if (hasInitScript) {
          const entryPoint:any = session.retrieve(TargidConstants.NEW_ENTRY_POINT);
          targid.push(entryPoint.view, null, null, entryPoint.options);
          session.remove(TargidConstants.NEW_ENTRY_POINT);
        } else {
          //just if no other option applies jump to the stored state
          this.jumpToStoredOrLastState();
        }
      };

      loginMenu.on('logged_in', () => {
        initSession();
      });
      if (!isLoggedIn()) {
        loginMenu.forceShowDialog();
      } else {
        initSession();
      }
    });
    return {graph, manager: clueManager, storyVis};
  }
}
