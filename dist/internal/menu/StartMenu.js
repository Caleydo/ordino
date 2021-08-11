import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GlobalEventHandler, PluginRegistry } from 'phovea_core';
import { EP_ORDINO_START_MENU_TAB, Ordino, useAsync } from '../..';
import { HighlightSessionCardContext } from '../OrdinoApp';
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
    React.useEffect(() => {
        // add short cut button to current session card to navbar in header
        let currentSessionNav = header.rightMenu.parentElement.querySelector('.current-session');
        // skip if tabs are not available (yet) or nav item is already initialized
        if (!tabs || currentSessionNav) {
            return;
        }
        currentSessionNav = header.rightMenu.ownerDocument.createElement('ul');
        currentSessionNav.classList.add('navbar-nav', 'navbar-right', 'current-session');
        ReactDOM.render(React.createElement("a", { href: "#", className: "nav-link", role: "button" },
            React.createElement("i", { className: "fas fa-history me-2" }),
            "Current Analysis Session"), currentSessionNav);
        const clickListener = (event) => {
            event.preventDefault();
            setActiveTab(tabs.find((tab) => tab.desc.id === 'ordino_sessions_tab')); // TODO: find better way to identify the tabs
            setHighlight(true); // the value is set to `false` when the animation in `CommonSessionCard` ends
        };
        currentSessionNav.addEventListener('click', clickListener);
        header.insertCustomRightMenu(currentSessionNav);
        return () => {
            currentSessionNav.removeEventListener('click', clickListener);
        };
    }, [tabs]);
    React.useEffect(() => {
        var _a;
        const isMenuOpen = (activeTab) ? true : false;
        // hide current session button when start menu is open
        (_a = header.rightMenu.parentElement.querySelector('.current-session')) === null || _a === void 0 ? void 0 : _a.toggleAttribute('hidden', isMenuOpen);
        // add class to body to toggle CLUE button mode selector and side panels via CSS (see _header.scss)
        // use CSS solution here, because there is no object reference to the button mode selector and side panels available
        // TODO: refactor this solution once the CLUE mode selector and side panels are React based
        document.body.classList.toggle('ordino-start-menu-open', isMenuOpen);
    }, [activeTab]);
    const mainMenuTabs = tabs === null || tabs === void 0 ? void 0 : tabs.filter((t) => t.desc.menu === EStartMenuSection.MAIN);
    const rightMenuTabs = tabs === null || tabs === void 0 ? void 0 : tabs.filter((t) => t.desc.menu === EStartMenuSection.RIGHT);
    return (React.createElement(React.Fragment, null,
        ReactDOM.createPortal(React.createElement(StartMenuLinks, { tabs: mainMenuTabs, status: status, activeTab: activeTab, setActiveTab: (a) => setActiveTab(a), mode: mode }), header.mainMenu),
        ReactDOM.createPortal(React.createElement(StartMenuLinks, { tabs: rightMenuTabs, status: status, activeTab: activeTab, setActiveTab: (a) => setActiveTab(a), mode: mode }), header.rightMenu),
        React.createElement(HighlightSessionCardContext.Provider, { value: { highlight, setHighlight } },
            React.createElement(StartMenuTabWrapper, { tabs: tabs, status: status, activeTab: activeTab, setActiveTab: setActiveTab, mode: mode }))));
}
function StartMenuLinks(props) {
    return (React.createElement(React.Fragment, null, props.status === 'success' && props.tabs.map((tab) => (React.createElement("li", { className: `nav-item ${props.activeTab === tab ? 'active' : ''}`, key: tab.desc.id },
        React.createElement("a", { className: "nav-link", href: `#${tab.desc.id}`, id: `${tab.desc.id}-tab`, role: "tab", "aria-controls": tab.desc.id, "aria-selected": (props.activeTab === tab), onClick: (evt) => {
                evt.preventDefault();
                if (props.mode === EStartMenuMode.OVERLAY && props.activeTab === tab) {
                    // remove :focus from link to remove highlight color
                    evt.currentTarget.blur();
                    // close tab only in overlay mode
                    props.setActiveTab(null);
                }
                else {
                    props.setActiveTab(tab);
                }
                return false;
            } },
            tab.desc.icon ? React.createElement("i", { className: tab.desc.icon }) : null,
            tab.desc.text))))));
}
function StartMenuTabWrapper(props) {
    if (props.activeTab === null) {
        return null;
    }
    return (React.createElement(React.Fragment, null, props.status === 'success' &&
        React.createElement("div", { id: "ordino-start-menu", className: `ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : ''} ${props.mode === EStartMenuMode.OVERLAY ? 'ordino-start-menu-overlay' : ''}` }, props.tabs.map((tab) => (React.createElement("div", { className: `tab-pane fade ${props.activeTab === tab ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`, key: tab.desc.id, id: tab.desc.id, role: "tabpanel", "aria-labelledby": `${tab.desc.id}-tab` },
            props.mode === EStartMenuMode.OVERLAY &&
                React.createElement("div", { className: "container-fluid" },
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col position-relative d-flex justify-content-end" },
                            React.createElement("button", { className: "btn-close", onClick: () => { props.setActiveTab(null); } })))),
            React.createElement(tab.factory, { isActive: props.activeTab === tab })))))));
}
//# sourceMappingURL=StartMenu.js.map