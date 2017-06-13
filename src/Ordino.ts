/**
 * Created by sam on 03.03.2017.
 */

import ProvenanceGraph from 'phovea_core/src/provenance/ProvenanceGraph';
import {create as createHeader, AppHeaderLink} from 'phovea_ui/src/header';
import {IEvent} from 'phovea_core/src/event';
import IDType from 'phovea_core/src/idtype/IDType';
import * as session from 'phovea_core/src/session';
import {AView} from './View';
import {MixedStorageProvenanceGraphManager} from 'phovea_core/src/provenance';
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
import {isLoggedIn} from 'phovea_core/src/security';
export {default as CLUEGraphManager} from 'phovea_clue/src/CLUEGraphManager';
import ACLUEWrapper, {createStoryVis} from 'phovea_clue/src/ACLUEWrapper';
import {initSession as initSessionCmd} from './cmds';
import EditProvenanceGraphMenu from 'ordino/src/EditProvenanceGraphMenu';
import {showProveanceGraphNotFoundDialog} from 'ordino/src/Dialogs';

export interface IOrdinoOptions {
  loginForm?: string;
}

export default class Ordino extends ACLUEWrapper {
  static readonly EVENT_OPEN_START_MENU = 'openStartMenu';
  private targid: Promise<Targid>;

  constructor(private readonly options: IOrdinoOptions = {}) {
    super();
    this.build(document.body, {replaceBody: false});
  }

  protected buildImpl(body: HTMLElement): {graph: Promise<ProvenanceGraph>, storyVis: Promise<VerticalStoryVis>, manager: CLUEGraphManager} {
    //create the common header
    const headerOptions = {
      showOptionsLink: true, // always activate options
      appLink: new AppHeaderLink('Ordino', (event) => {
        event.preventDefault();
        this.fire(Ordino.EVENT_OPEN_START_MENU);
        return false;
      })
    };
    const header = createHeader(<HTMLElement>body.querySelector('div.box'), headerOptions);

    const aboutDialogBody = header.aboutDialog;
    aboutDialogBody.insertAdjacentHTML('afterbegin', '<div class="alert alert-warning" role="alert"><strong>Disclaimer</strong> This software is <strong>for research purpose only</strong>.</span></div>');

    this.on('jumped_to,loaded_graph', () => header.ready());
    //load all available provenance graphs
    const manager = new MixedStorageProvenanceGraphManager({
      prefix: 'ordino',
      storage: localStorage,
      application: 'ordino'
    });
    const clueManager = new CLUEGraphManager(manager);

    header.wait();

    const loginMenu = new LoginMenu(header, {
      insertIntoHeader: true,
      loginForm: this.options.loginForm
    });
    loginMenu.on(LoginMenu.EVENT_LOGGED_OUT, ()=> {
      // reopen after logged out
      loginMenu.forceShowDialog();
    });

    const provenanceMenu = new EditProvenanceGraphMenu(clueManager, header.rightMenu);

    const modeSelector = body.querySelector('header');
    modeSelector.className += 'clue-modeselector';
    cmode.createButton(modeSelector, {
      size: 'sm'
    });

    const graph = clueManager.list().then((graphs) => {
      return clueManager.choose(graphs, true);
    });
    graph.catch((error: {graph: string}) => {
      showProveanceGraphNotFoundDialog(clueManager, error.graph);
    });


    const main = <HTMLElement>document.body.querySelector('main');
    main.classList.add('targid');

    graph.then((graph) => {
      provenanceMenu.setGraph(graph);
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
      main.appendChild(startMenuNode);
      startMenuNode.classList.add('startMenu');
      const startMenu = new StartMenu(startMenuNode, {targid});

      this.on(Ordino.EVENT_OPEN_START_MENU, () => startMenu.open());
      targid.on(Ordino.EVENT_OPEN_START_MENU, () => startMenu.open());
      targid.on(AView.EVENT_UPDATE_ENTRY_POINT, (event:IEvent, idtype: IDType | string, namedSet: INamedSet) => startMenu.updateEntryPointList(idtype, namedSet));

      const initSession = () => {
        const hasInitScript = session.has(TargidConstants.NEW_ENTRY_POINT);

        if(graph.isEmpty && !hasInitScript) {
          startMenu.open();
        } else if (hasInitScript) {
          const {view, options, defaultSessionValues} = <any>session.retrieve(TargidConstants.NEW_ENTRY_POINT);

          if (defaultSessionValues && Object.keys(defaultSessionValues).length > 0) {
            graph.push(initSessionCmd(defaultSessionValues));
          }
          targid.push(view, null, null, options);
          session.remove(TargidConstants.NEW_ENTRY_POINT);
        } else {
          //just if no other option applies jump to the stored state
          this.jumpToStoredOrLastState();
        }
      };

      // INITIAL LOGIC
      loginMenu.on(LoginMenu.EVENT_LOGGED_IN, () => {
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
