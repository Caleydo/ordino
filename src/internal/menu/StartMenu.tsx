import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GlobalEventHandler, PluginRegistry} from 'phovea_core';
import {EP_ORDINO_START_MENU_TAB, Ordino, useAsync} from '../..';
import {AppHeader} from 'phovea_ui';
import {HighlightSessionCardContext} from '../OrdinoApp';
import {IStartMenuTabDesc, IStartMenuTabPlugin} from '../../base';


export enum EStartMenuSection {
  /**
   * Main menu section in the header
   */
  MAIN = 'main',

  /**
   * Right menu section in the header
   */
  RIGHT = 'right'
}

export enum EStartMenuMode {
  /**
   * no analysis in the background, the start menu cannot be closed
   */
  START = 'start',

  /**
   * an analysis in the background, the start menu can be closed
   */
  OVERLAY = 'overlay'
}

export enum EStartMenuOpen {
  /**
   * no analysis in the background, the start menu cannot be closed
   */
  OPEN = 'open',

  /**
   * an analysis in the background, the start menu can be closed
   */
  CLOSED = 'closed'
}


export interface IStartMenuTabProps {
  /**
   * Flag if the tab is currently active and visible
   */
  isActive: boolean;
}


interface IStartMenuTabWrapperProps {
  /**
   * List of tabs
   */
  tabs: IStartMenuTabPlugin[];

  /**
   * The currently active (i.e., visible tab)
   * `null` = all tabs are closed
   */
  activeTab: IStartMenuTabPlugin;

  /**
   * Set the active tab
   * `null` closes all tabs
   */
  setActiveTab: React.Dispatch<React.SetStateAction<IStartMenuTabPlugin>>;

  /**
   * Define the mode of the start menu
   */
  mode: EStartMenuMode;

  /**
   * Status of the async loading of the registered plugins
   */
  status: 'idle' | 'pending' | 'success' | 'error';
}

function byPriority(a: any, b: any) {
  return (a.priority || 10) - (b.priority || 10);
}


export function StartMenuComponent({header, mode, open}: {header: AppHeader, mode: EStartMenuMode, open: EStartMenuOpen}) {
  // always use dark theme for header independent of if the menu is open or closed
  header.toggleDarkTheme(true);

  // no active tab until `open` is set OR a link in the header navigation is clicked
  const [activeTab, setActiveTab] = React.useState(null);
  const [highlight, setHighlight] = React.useState(false);

  const loadTabs = React.useMemo(() => () => {
    const tabEntries = PluginRegistry.getInstance().listPlugins(EP_ORDINO_START_MENU_TAB).map((d) => d as IStartMenuTabDesc).sort(byPriority);
    return Promise.all(tabEntries.map((section) => section.load()));
  }, []);

  // load all registered tabs
  const {status, value: tabs} = useAsync(loadTabs);


  React.useEffect(() => {
    // legacy event from ATDPApplication
    const listener = () => setActiveTab(tabs?.[0]);
    GlobalEventHandler.getInstance().on(Ordino.EVENT_OPEN_START_MENU, listener);

    return () => {
      GlobalEventHandler.getInstance().off(Ordino.EVENT_OPEN_START_MENU, listener);
    };
  }, [status]);

  React.useEffect(() => {
    // set the active tab when the start menu should be opened
    // tabs are sorted, the one with the lowest priority will be the default open tab
    setActiveTab((open === EStartMenuOpen.OPEN) ? tabs?.[0] : null);
  }, [status, open]);


  React.useEffect(() => {
    // add short cut button to current session card to navbar in header
    let currentSessionNav = header.rightMenu.parentElement.querySelector('.current-session') as HTMLUListElement;

    // skip if tabs are not available (yet) or nav item is already initialized
    if(!tabs || currentSessionNav) {
      return;
    }

    currentSessionNav = header.rightMenu.ownerDocument.createElement('ul');
    currentSessionNav.classList.add('navbar-nav', 'navbar-right', 'current-session');

    ReactDOM.render(<a href="#" className="nav-link" role="button"><i className="fas fa-history me-2"></i>Current Analysis Session</a>, currentSessionNav);

    const clickListener = (event) => {
      event.preventDefault();
      setActiveTab(tabs.find((tab) => tab.desc.id === 'ordino_sessions_tab')); // TODO: find better way to identify the tabs
      setHighlight(true); // the value is set to `false` when the animation in `CommonSessionCard` ends
    };

    currentSessionNav.addEventListener('click', clickListener);

    header.insertCustomRightMenu(currentSessionNav);

    return () => { // clean up
      currentSessionNav.removeEventListener('click', clickListener);
    };

  }, [tabs]);

  React.useEffect(() => {
    const isMenuOpen = (activeTab) ? true : false;

    // hide current session button when start menu is open
    header.rightMenu.parentElement.querySelector('.current-session')?.toggleAttribute('hidden', isMenuOpen);

    // add class to body to toggle CLUE button mode selector and side panels via CSS (see _header.scss)
    // use CSS solution here, because there is no object reference to the button mode selector and side panels available
    // TODO: refactor this solution once the CLUE mode selector and side panels are React based
    document.body.classList.toggle('ordino-start-menu-open', isMenuOpen);
  }, [activeTab]);

  const mainMenuTabs = tabs?.filter((t) => t.desc.menu === EStartMenuSection.MAIN);
  const rightMenuTabs = tabs?.filter((t) => t.desc.menu === EStartMenuSection.RIGHT);

  return (
    <>
      {ReactDOM.createPortal(
        <StartMenuLinks tabs={mainMenuTabs} status={status} activeTab={activeTab} setActiveTab={(a) => setActiveTab(a)} mode={mode}></StartMenuLinks>,
        header.mainMenu
      )}
      {ReactDOM.createPortal(
        <StartMenuLinks tabs={rightMenuTabs} status={status} activeTab={activeTab} setActiveTab={(a) => setActiveTab(a)} mode={mode}></StartMenuLinks>,
        header.rightMenu
      )}
      <HighlightSessionCardContext.Provider value={{highlight, setHighlight}}>
        <StartMenuTabWrapper tabs={tabs} status={status} activeTab={activeTab} setActiveTab={setActiveTab} mode={mode}></StartMenuTabWrapper>
      </HighlightSessionCardContext.Provider>
    </>
  );
}

function StartMenuLinks(props: IStartMenuTabWrapperProps) {
  return (
    <>
      {props.status === 'success' && props.tabs.map((tab) => (
        <li className={`nav-item ${props.activeTab === tab ? 'active' : ''}`} key={tab.desc.id}>
          <a className="nav-link"
            href={`#${tab.desc.id}`}
            id={`${tab.desc.id}-tab`}
            role="tab"
            aria-controls={tab.desc.id}
            aria-selected={(props.activeTab === tab)}
            onClick={(evt) => {
              evt.preventDefault();
              if (props.mode === EStartMenuMode.OVERLAY && props.activeTab === tab) {
                // remove :focus from link to remove highlight color
                evt.currentTarget.blur();

                // close tab only in overlay mode
                props.setActiveTab(null);
              } else {
                props.setActiveTab(tab);
              }

              return false;
            }}
          >
            {tab.desc.icon ? <i className={tab.desc.icon}></i> : null}
            {tab.desc.text}
          </a>
        </li>
      ))}
    </>
  );
}


function StartMenuTabWrapper(props: IStartMenuTabWrapperProps) {
  if (props.activeTab === null) {
    return null;
  }

  return (
    <>
      {props.status === 'success' &&
        <div id="ordino-start-menu" className={`ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : ''} ${props.mode === EStartMenuMode.OVERLAY ? 'ordino-start-menu-overlay' : ''}`}>
          {props.tabs.map((tab) => (
            <div className={`tab-pane fade ${props.activeTab === tab ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`}
              key={tab.desc.id}
              id={tab.desc.id}
              role="tabpanel"
              aria-labelledby={`${tab.desc.id}-tab`}
            >
              {props.mode === EStartMenuMode.OVERLAY &&
                <div className="container-fluid">
                  <div className="row">
                    <div className="col position-relative d-flex justify-content-end">
                      <button className="btn-close" onClick={() => {props.setActiveTab(null);}}>
                      </button>
                    </div>
                  </div>
                </div>
              }
              <tab.factory isActive={props.activeTab === tab} />
            </div>
          ))}
        </div>
      }</>
  );
}
