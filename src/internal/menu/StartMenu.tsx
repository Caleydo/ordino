import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GlobalEventHandler, PluginRegistry} from 'phovea_core';
import {EP_ORDINO_START_MENU_TAB, Ordino, useAsync} from '../..';
import {AppHeader} from 'phovea_ui';
import {HighlightSessionCardContext} from '../OrdinoApp';
import {EP_ORDINO_START_MENU_TAB_SHORTCUT, IStartMenuTabDesc, IStartMenuTabShortcutDesc} from '../../base';
import {StartMenuLinks} from './StartMenuLinks';
import {StartMenuTabWrapper} from './StartMenuTabWrapper';
import {StartMenuTabShortcuts} from './StartMenuTabShortcuts';


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


  // create shortcuts rightMenu
  React.useEffect(() => {
    const shortcutMenu = header.rightMenu.ownerDocument.createElement('ul');
    shortcutMenu.classList.add('navbar-nav', 'navbar-right', 'shortcut-menu');
    header.insertCustomRightMenu(shortcutMenu);
  }, []);


  React.useEffect(() => {
    const isMenuOpen = (activeTab) ? true : false;

    // add class to body to toggle CLUE button mode selector and side panels via CSS (see _header.scss)
    // use CSS solution here, because there is no object reference to the button mode selector and side panels available
    // TODO: refactor this solution once the CLUE mode selector and side panels are React based
    document.body.classList.toggle('ordino-start-menu-open', isMenuOpen);
  }, [activeTab]);

  const mainMenuTabs = tabs?.filter((t) => t.desc.menu === EStartMenuSection.MAIN);
  const rightMenuTabs = tabs?.filter((t) => t.desc.menu === EStartMenuSection.RIGHT);
  const shortcuts = PluginRegistry.getInstance().listPlugins(EP_ORDINO_START_MENU_TAB_SHORTCUT).map((d) => d as unknown as IStartMenuTabShortcutDesc).sort(byPriority);
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

      {tabs && !activeTab && ReactDOM.createPortal(
        <StartMenuTabShortcuts tabs={tabs} shortcuts={shortcuts} status={status} setActiveTab={(a) => setActiveTab(a)} setHighlight={setHighlight} />,
        header.mainMenu.ownerDocument.querySelector('.shortcut-menu')
      )}
      <HighlightSessionCardContext.Provider value={{highlight, setHighlight}}>
        <StartMenuTabWrapper tabs={tabs} status={status} activeTab={activeTab} setActiveTab={setActiveTab} mode={mode}></StartMenuTabWrapper>
      </HighlightSessionCardContext.Provider>
    </>
  );
}
