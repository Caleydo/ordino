import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GlobalEventHandler } from 'phovea_core';
import { Ordino } from '../..';
import { DatasetsTab, SessionsTab, ToursTab } from './tabs';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { HighlightSessionCardContext } from '../OrdinoApp';
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
const tabs = [
    { id: 'datasets', title: 'Datasets', factory: DatasetsTab },
    { id: 'sessions', title: 'Analysis Sessions', factory: SessionsTab },
    { id: 'tours', title: 'Tours', factory: ToursTab },
];
export function StartMenuComponent({ header, mode, open }) {
    // no active tab until `open` is set OR a link in the header navigation is clicked
    const [activeTab, setActiveTab] = React.useState(null);
    const [highlight, setHighlight] = React.useState(false);
    React.useEffect(() => {
        // legacy event from ATDPApplication
        const listener = () => setActiveTab(tabs[0]);
        GlobalEventHandler.getInstance().on(Ordino.EVENT_OPEN_START_MENU, listener);
        return () => {
            GlobalEventHandler.getInstance().off(Ordino.EVENT_OPEN_START_MENU, listener);
        };
    }, []);
    React.useEffect(() => {
        // set the active tab when the start menu should be opened
        setActiveTab((open === EStartMenuOpen.OPEN) ? tabs[0] : null);
    }, [open]);
    React.useEffect(() => {
        // switch header to dark theme when a tab is active
        header.toggleDarkTheme((activeTab) ? true : false);
    }, [header, activeTab]);
    React.useEffect(() => {
        let link = header.rightMenu.querySelector('*[data-header="currentAnalysisSession"]');
        if (!link) {
            link = header.addRightMenu('Current session', (event) => {
                event.preventDefault();
                setActiveTab(tabs[1]); // TODO: find better way to identify the tabs
                setHighlight(true); // TODO: set highlight back to false
            });
            link.firstElementChild.innerHTML = '<i class="fas fa-history mr-2"></i>Current Analysis Session';
            link.setAttribute('data-header', 'currentAnalysisSession');
            link.classList.add('hidden');
        }
        link.toggleAttribute('hidden', (activeTab) ? true : false);
    }, [header, activeTab]);
    return (React.createElement(React.Fragment, null,
        ReactDOM.createPortal(React.createElement(MainMenuLinks, { tabs: tabs, activeTab: activeTab, setActiveTab: (a) => setActiveTab(a), mode: mode }), header.mainMenu),
        React.createElement(HighlightSessionCardContext.Provider, { value: { highlight } },
            React.createElement(StartMenuTabs, { tabs: tabs, activeTab: activeTab, setActiveTab: setActiveTab, mode: mode }))));
}
function MainMenuLinks(props) {
    return (React.createElement(React.Fragment, null, props.tabs.map((tab) => (React.createElement("li", { className: `nav-item ${props.activeTab === tab ? 'active' : ''}`, key: tab.id },
        React.createElement("a", { className: "nav-link", href: `#${tab.id}`, id: `${tab.id}-tab`, role: "tab", "aria-controls": tab.id, "aria-selected": (props.activeTab === tab), onClick: (evt) => {
                evt.preventDefault();
                if (props.mode === EStartMenuMode.OVERLAY && props.activeTab === tab) {
                    // close tab only in overlay mode
                    props.setActiveTab(null);
                }
                else {
                    props.setActiveTab(tab);
                }
                return false;
            } }, tab.title))))));
}
function StartMenuTabs(props) {
    if (props.activeTab === null) {
        return null;
    }
    return (React.createElement("div", { id: "ordino-start-menu", className: `ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : ''}` }, props.tabs.map((tab) => (React.createElement("div", { className: `tab-pane fade ${props.activeTab === tab ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`, key: tab.id, id: tab.id, role: "tabpanel", "aria-labelledby": `${tab.id}-tab` },
        props.mode === EStartMenuMode.OVERLAY &&
            React.createElement(Container, { fluid: true },
                React.createElement(Row, null,
                    React.createElement(Col, { className: "d-flex justify-content-end" },
                        React.createElement(Button, { className: "start-menu-close", variant: "link", onClick: () => { props.setActiveTab(null); } },
                            React.createElement("i", { className: "fas fa-times" }))))),
        React.createElement(tab.factory, null))))));
}
//# sourceMappingURL=StartMenu.js.map