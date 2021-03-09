import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GlobalEventHandler } from 'phovea_core';
import { Ordino } from '../..';
import { DatasetsTab, SessionsTab, ToursTab } from './tabs';
import { Button, Col, Container, Row } from 'react-bootstrap';
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
const tabs = [
    { id: 'datasets', title: 'Datasets' },
    { id: 'sessions', title: 'Analysis Sessions' },
    { id: 'tours', title: 'Tours' },
];
export function StartMenuComponent({ header, mode, open }) {
    const [activeTab, setActiveTab] = React.useState(null); // first tab in overlay mode OR close all tabs in overlay mode
    React.useEffect(() => {
        const listener = () => setActiveTab(tabs[0]);
        GlobalEventHandler.getInstance().on(Ordino.EVENT_OPEN_START_MENU, listener);
        return () => {
            GlobalEventHandler.getInstance().off(Ordino.EVENT_OPEN_START_MENU, listener);
        };
    }, []);
    React.useEffect(() => {
        setActiveTab((open) ? tabs[0] : null);
    }, [open]);
    React.useEffect(() => {
        // switch header to dark theme when a tab is active
        header.toggleDarkTheme((activeTab) ? true : false);
    }, [header, activeTab]);
    return (React.createElement(React.Fragment, null,
        ReactDOM.createPortal(React.createElement(MainMenuLinks, { tabs: tabs, activeTab: activeTab, setActiveTab: (a) => setActiveTab(a), mode: mode }), header.mainMenu),
        React.createElement(StartMenuTabs, { tabs: tabs, activeTab: activeTab, setActiveTab: setActiveTab, mode: mode })));
}
function MainMenuLinks(props) {
    return (React.createElement(React.Fragment, null, props.tabs.map((tab) => (React.createElement("li", { className: `nav-item ${props.activeTab === tab ? 'active' : ''}`, key: tab.id },
        React.createElement("a", { className: "nav-link", href: `#${tab.id}`, id: `${tab.id}-tab`, role: "tab", "aria-controls": tab.id, "aria-selected": (props.activeTab === tab), onClick: (evt) => {
                evt.preventDefault();
                window.scrollTo(0, 0);
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
    return (React.createElement("div", { className: `ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : ''}` }, props.tabs.map((tab, index) => (React.createElement("div", { className: `tab-pane fade ${props.activeTab === tab ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`, key: tab.id, id: tab.id, role: "tabpanel", "aria-labelledby": `${tab.id}-tab` },
        props.mode === EStartMenuMode.OVERLAY &&
            React.createElement(Container, { fluid: true },
                React.createElement(Row, null,
                    React.createElement(Col, { className: "d-flex justify-content-end" },
                        React.createElement(Button, { className: "start-menu-close", variant: "link", onClick: () => { props.setActiveTab(null); } },
                            React.createElement("i", { className: "fas fa-times" }))))),
        index === 0 ? React.createElement(DatasetsTab, null) : null,
        index === 1 ? React.createElement(SessionsTab, null) : null,
        index === 2 ? React.createElement(ToursTab, null) : null)))));
}
//# sourceMappingURL=StartMenuReact.js.map