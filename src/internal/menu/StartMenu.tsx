import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PluginRegistry } from 'visyn_core/plugin';
import { useAsync } from 'visyn_core/hooks';
import { GlobalEventHandler } from 'visyn_core/base';
import { AppHeader } from 'tdp_core';

// eslint-disable-next-line import/no-cycle
import { Ordino } from '../../app/Ordino';
import { EStartMenuMode, EStartMenuOpen, EStartMenuSection, HighlightSessionCardContext } from '../constants';
import { EP_ORDINO_START_MENU_TAB, EP_ORDINO_START_MENU_TAB_SHORTCUT, IStartMenuTabDesc, IStartMenuTabShortcutDesc } from '../../base/extensions';
import { StartMenuLinks } from './StartMenuLinks';
import { StartMenuTabWrapper } from './StartMenuTabWrapper';
import { StartMenuTabShortcuts } from './StartMenuTabShortcuts';

function byPriority(a: any, b: any) {
  return (a.priority || 10) - (b.priority || 10);
}

export function StartMenuComponent({ header, mode, open }: { header: AppHeader; mode: EStartMenuMode; open: EStartMenuOpen }) {
  // always use dark theme for header independent of if the menu is open or closed
  header.toggleDarkTheme(true);

  // no active tab until `open` is set OR a link in the header navigation is clicked
  const [activeTab, setActiveTab] = React.useState(null);
  const [highlight, setHighlight] = React.useState(false);

  const loadTabs = React.useMemo(
    () => () => {
      const tabEntries = PluginRegistry.getInstance()
        .listPlugins(EP_ORDINO_START_MENU_TAB)
        .map((d) => d as IStartMenuTabDesc)
        .sort(byPriority);
      return Promise.all(tabEntries.map((section) => section.load()));
    },
    [],
  );

  // load all registered tabs
  const { status, value: tabs } = useAsync(loadTabs, []);

  React.useEffect(() => {
    // legacy event from ATDPApplication
    const listener = () => setActiveTab(tabs?.[0]);
    GlobalEventHandler.getInstance().on(Ordino.EVENT_OPEN_START_MENU, listener);

    return () => {
      GlobalEventHandler.getInstance().off(Ordino.EVENT_OPEN_START_MENU, listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  React.useEffect(() => {
    // set the active tab when the start menu should be opened
    // tabs are sorted, the one with the lowest priority will be the default open tab
    setActiveTab(open === EStartMenuOpen.OPEN ? tabs?.[0] : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, open]);

  // create shortcuts rightMenu
  React.useEffect(() => {
    const shortcutMenu = header.rightMenu.ownerDocument.createElement('ul');
    shortcutMenu.classList.add('navbar-nav', 'navbar-right', 'shortcut-menu');
    header.insertCustomRightMenu(shortcutMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const isMenuOpen = !!activeTab;

    // add class to body to toggle CLUE button mode selector and side panels via CSS (see _header.scss)
    // use CSS solution here, because there is no object reference to the button mode selector and side panels available
    // TODO: refactor this solution once the CLUE mode selector and side panels are React based
    document.body.classList.toggle('ordino-start-menu-open', isMenuOpen);
  }, [activeTab]);

  const mainMenuTabs = tabs?.filter((t) => t.desc.menu === EStartMenuSection.MAIN);
  const rightMenuTabs = tabs?.filter((t) => t.desc.menu === EStartMenuSection.RIGHT);
  const context = React.useMemo(() => ({ highlight, setHighlight }), [highlight]);
  const shortcuts = PluginRegistry.getInstance()
    .listPlugins(EP_ORDINO_START_MENU_TAB_SHORTCUT)
    .map((d) => d as unknown as IStartMenuTabShortcutDesc)
    .sort(byPriority);
  return (
    <>
      {ReactDOM.createPortal(
        <StartMenuLinks tabs={mainMenuTabs} status={status} activeTab={activeTab} setActiveTab={(a) => setActiveTab(a)} mode={mode} />,
        header.mainMenu,
      )}
      {ReactDOM.createPortal(
        <StartMenuLinks tabs={rightMenuTabs} status={status} activeTab={activeTab} setActiveTab={(a) => setActiveTab(a)} mode={mode} />,
        header.rightMenu,
      )}
      {tabs &&
        !activeTab &&
        ReactDOM.createPortal(
          <StartMenuTabShortcuts tabs={tabs} shortcuts={shortcuts} status={status} setActiveTab={(a) => setActiveTab(a)} setHighlight={setHighlight} />,
          header.mainMenu.ownerDocument.querySelector('.shortcut-menu'),
        )}
      {
        // eslint-disable-next-line react/jsx-no-constructed-context-values, prettier/prettier
      }
      <HighlightSessionCardContext.Provider value={context}>
        <StartMenuTabWrapper tabs={tabs} status={status} activeTab={activeTab} setActiveTab={setActiveTab} mode={mode} />
      </HighlightSessionCardContext.Provider>
    </>
  );
}
