/**
 * Created by sam on 03.03.2017.
 */

import ProvenanceGraph from 'phovea_core/src/provenance/ProvenanceGraph';
import {create as createHeader, AppHeaderLink} from 'phovea_ui/src/header';
import {MixedStorageProvenanceGraphManager} from 'phovea_core/src/provenance';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {VerticalStoryVis} from 'phovea_clue/src/storyvis';
import * as cmode from 'phovea_clue/src/mode';
import {create as createProvVis} from 'phovea_clue/src/provvis';
import LoginMenu from 'phovea_clue/src/menu/LoginMenu';
import {isLoggedIn} from 'phovea_core/src/security';
export {default as CLUEGraphManager} from 'phovea_clue/src/CLUEGraphManager';
import ACLUEWrapper, {createStoryVis} from 'phovea_clue/src/ACLUEWrapper';
import EditProvenanceGraphMenu from './EditProvenanceGraphMenu';
import {showProveanceGraphNotFoundDialog} from './Dialogs';
import {mixin} from 'phovea_core/src';

export interface IOrdinoOptions {
  loginForm?: string;
  name?: string;
  prefix?: string;
}

export abstract class AOrdino<T> extends ACLUEWrapper {
  static readonly EVENT_OPEN_START_MENU = 'openStartMenu';

  private readonly options: IOrdinoOptions = {
    loginForm: undefined,
    name: 'Ordino',
    prefix: 'ordino'
  };

  protected app: Promise<T> = null;

  constructor(options: IOrdinoOptions = {}) {
    super();
    mixin(this.options, options);
    this.build(document.body, {replaceBody: false});
  }

  protected buildImpl(body: HTMLElement): {graph: Promise<ProvenanceGraph>, storyVis: Promise<VerticalStoryVis>, manager: CLUEGraphManager} {
    //create the common header
    const headerOptions = {
      showOptionsLink: true, // always activate options
      appLink: new AppHeaderLink(this.options.name, (event) => {
        event.preventDefault();
        this.fire(AOrdino.EVENT_OPEN_START_MENU);
        return false;
      })
    };
    const header = createHeader(<HTMLElement>body.querySelector('div.box'), headerOptions);

    const aboutDialogBody = header.aboutDialog;
    aboutDialogBody.insertAdjacentHTML('afterbegin', '<div class="alert alert-warning" role="alert"><strong>Disclaimer</strong> This software is <strong>for research purpose only</strong>.</span></div>');

    this.on('jumped_to,loaded_graph', () => header.ready());
    //load all available provenance graphs
    const manager = new MixedStorageProvenanceGraphManager({
      prefix: this.options.prefix,
      storage: localStorage,
      application: this.options.prefix
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


    const main = <HTMLElement>document.body.querySelector('main');
    main.classList.add('targid');

    //wrapper around to better control when the graph will be resolved
    let graphResolver: (graph: Promise<ProvenanceGraph>)=>void;
    const graph = new Promise<ProvenanceGraph>((resolve, reject) => graphResolver = resolve);

    graph.catch((error: {graph: string}) => {
      showProveanceGraphNotFoundDialog(clueManager, error.graph);
    });

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

    this.app = graph.then((graph) => this.createApp(graph, clueManager, main));

    const initSession = () => {
      //logged in, so we can resolve the graph for real
      graphResolver(clueManager.list().then((graphs) => {
        return clueManager.choose(graphs, true);
      }));

      this.app.then((appInstance) => this.initSessionImpl(appInstance));
    };

    let forceShowLoginDialogTimeout: any = -1;
    // INITIAL LOGIC
    loginMenu.on(LoginMenu.EVENT_LOGGED_IN, () => {
      clearTimeout(forceShowLoginDialogTimeout);
      initSession();
    });
    if (!isLoggedIn()) {
      //wait 1sec before the showing the login dialog to give the auto login mechanism a chance
      forceShowLoginDialogTimeout = setTimeout(() => loginMenu.forceShowDialog(), 1000);
    } else {
      initSession();
    }

    return {graph, manager: clueManager, storyVis};
  }

  protected abstract createApp(graph: ProvenanceGraph, manager: CLUEGraphManager, main: HTMLElement): Promise<T>|T;
  protected abstract initSessionImpl(app: T);
}

export default AOrdino;
