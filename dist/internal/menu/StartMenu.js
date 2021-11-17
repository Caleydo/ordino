import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GlobalEventHandler, PluginRegistry } from 'tdp_core';
import { EP_ORDINO_START_MENU_TAB, Ordino, useAsync } from '../..';
import { HighlightSessionCardContext } from '../OrdinoApp';
import { EP_ORDINO_START_MENU_TAB_SHORTCUT } from '../../base';
import { StartMenuLinks } from './StartMenuLinks';
import { StartMenuTabWrapper } from './StartMenuTabWrapper';
import { StartMenuTabShortcuts } from './StartMenuTabShortcuts';
export var EStartMenuSection;
(function (EStartMenuSection) {
    /**
     * Main menu section in the header
     */
    EStartMenuSection["MAIN"] = "main";
    /**
     * Right menu section in the header
     */
    EStartMenuSection["RIGHT"] = "right";
})(EStartMenuSection || (EStartMenuSection = {}));
export var EStartMenuMode;
(function (EStartMenuMode) {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    EStartMenuMode["START"] = "start";
    /**
     * an analysis in the background, the start menu can be closed
     */
    EStartMenuMode["OVERLAY"] = "overlay";
})(EStartMenuMode || (EStartMenuMode = {}));
export var EStartMenuOpen;
(function (EStartMenuOpen) {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    EStartMenuOpen["OPEN"] = "open";
    /**
     * an analysis in the background, the start menu can be closed
     */
    EStartMenuOpen["CLOSED"] = "closed";
})(EStartMenuOpen || (EStartMenuOpen = {}));
function byPriority(a, b) {
    return (a.priority || 10) - (b.priority || 10);
}
export function StartMenuComponent({ header, mode, open }) {
    // always use dark theme for header independent of if the menu is open or closed
    header.toggleDarkTheme(true);
    // no active tab until `open` is set OR a link in the header navigation is clicked
    const [activeTab, setActiveTab] = React.useState(null);
    const [highlight, setHighlight] = React.useState(false);
    const loadTabs = React.useMemo(() => () => {
        const tabEntries = PluginRegistry.getInstance().listPlugins(EP_ORDINO_START_MENU_TAB).map((d) => d).sort(byPriority);
        return Promise.all(tabEntries.map((section) => section.load()));
    }, []);
    // load all registered tabs
    const { status, value: tabs } = useAsync(loadTabs);
    React.useEffect(() => {
        // legacy event from ATDPApplication
        const listener = () => setActiveTab(tabs === null || tabs === void 0 ? void 0 : tabs[0]);
        GlobalEventHandler.getInstance().on(Ordino.EVENT_OPEN_START_MENU, listener);
        return () => {
            GlobalEventHandler.getInstance().off(Ordino.EVENT_OPEN_START_MENU, listener);
        };
    }, [status]);
    React.useEffect(() => {
        // set the active tab when the start menu should be opened
        // tabs are sorted, the one with the lowest priority will be the default open tab
        setActiveTab((open === EStartMenuOpen.OPEN) ? tabs === null || tabs === void 0 ? void 0 : tabs[0] : null);
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
    const mainMenuTabs = tabs === null || tabs === void 0 ? void 0 : tabs.filter((t) => t.desc.menu === EStartMenuSection.MAIN);
    const rightMenuTabs = tabs === null || tabs === void 0 ? void 0 : tabs.filter((t) => t.desc.menu === EStartMenuSection.RIGHT);
    const shortcuts = PluginRegistry.getInstance().listPlugins(EP_ORDINO_START_MENU_TAB_SHORTCUT).map((d) => d).sort(byPriority);
    return (React.createElement(React.Fragment, null,
        ReactDOM.createPortal(React.createElement(StartMenuLinks, { tabs: mainMenuTabs, status: status, activeTab: activeTab, setActiveTab: (a) => setActiveTab(a), mode: mode }), header.mainMenu),
        ReactDOM.createPortal(React.createElement(StartMenuLinks, { tabs: rightMenuTabs, status: status, activeTab: activeTab, setActiveTab: (a) => setActiveTab(a), mode: mode }), header.rightMenu),
        tabs && !activeTab && ReactDOM.createPortal(React.createElement(StartMenuTabShortcuts, { tabs: tabs, shortcuts: shortcuts, status: status, setActiveTab: (a) => setActiveTab(a), setHighlight: setHighlight }), header.mainMenu.ownerDocument.querySelector('.shortcut-menu')),
        React.createElement(HighlightSessionCardContext.Provider, { value: { highlight, setHighlight } },
            React.createElement(StartMenuTabWrapper, { tabs: tabs, status: status, activeTab: activeTab, setActiveTab: setActiveTab, mode: mode }))));
}
//# sourceMappingURL=StartMenu.js.map