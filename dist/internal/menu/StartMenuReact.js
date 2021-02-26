import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GlobalEventHandler } from 'phovea_core';
import { Ordino } from '../..';
import { DatasetsTab, SessionsTab, ToursTab } from './tabs';
import { Button, Col, Container, Row } from 'react-bootstrap';
const tabs = [
    { id: 'datasets', title: 'Datasets' },
    { id: 'sessions', title: 'Analysis Sessions' },
    { id: 'tours', title: 'Tours' },
];
// tslint:disable-next-line: variable-name
export const GraphContext = React.createContext({ graph: null, manager: null });
export function StartMenuComponent({ header, manager, graph, modePromise }) {
    const [mode, setMode] = React.useState('start');
    const [active, setActive] = React.useState(null); // first tab in overlay mode OR close all tabs in overlay mode
    React.useEffect(() => {
        const listener = () => setActive(tabs[0]);
        GlobalEventHandler.getInstance().on(Ordino.EVENT_OPEN_START_MENU, listener);
        return () => {
            GlobalEventHandler.getInstance().off(Ordino.EVENT_OPEN_START_MENU, listener);
        };
    }, []);
    React.useEffect(() => {
        modePromise.then((mode) => {
            console.log('set mode', mode);
            setMode(mode);
            setActive((mode === 'start') ? tabs[0] : null);
        });
    }, [modePromise]);
    React.useEffect(() => {
        // switch header to dark theme when a tab is active
        header.toggleDarkTheme((active) ? true : false);
    }, [header, active]);
    console.log('start menu component');
    return (React.createElement(React.Fragment, null,
        ReactDOM.createPortal(React.createElement(MainMenuLinks, { tabs: tabs, active: active, setActive: (a) => setActive(a), mode: mode }), header.mainMenu),
        React.createElement(GraphContext.Provider, { value: { manager, graph } },
            React.createElement(StartMenu, { tabs: tabs, active: active, setActive: setActive, mode: mode }))));
}
function MainMenuLinks(props) {
    return (React.createElement(React.Fragment, null, props.tabs.map((tab) => (React.createElement("li", { className: `nav-item ${props.active === tab ? 'active' : ''}`, key: tab.id },
        React.createElement("a", { className: "nav-link", href: `#${tab.id}`, id: `${tab.id}-tab`, role: "tab", "aria-controls": tab.id, "aria-selected": (props.active === tab), onClick: (evt) => {
                evt.preventDefault();
                window.scrollTo(0, 0);
                if (props.mode === 'overlay' && props.active === tab) {
                    // close tab only in overlay mode
                    props.setActive(null);
                }
                else {
                    props.setActive(tab);
                }
                return false;
            } }, tab.title))))));
}
function StartMenu(props) {
    return (React.createElement("div", { className: `ordino-start-menu tab-content ${props.active ? 'ordino-start-menu-open' : ''}` }, props.tabs.map((tab, index) => (React.createElement("div", { className: `tab-pane fade ${props.active === tab ? `active show` : ''} ${props.mode === 'start' ? `pt-5` : ''}`, key: tab.id, id: tab.id, role: "tabpanel", "aria-labelledby": `${tab.id}-tab` },
        props.mode === 'overlay' &&
            React.createElement(Container, { fluid: true },
                React.createElement(Row, null,
                    React.createElement(Col, { className: "d-flex justify-content-end" },
                        React.createElement(Button, { className: "start-menu-close", variant: "link", onClick: () => { props.setActive(null); } },
                            React.createElement("i", { className: "fas fa-times" }))))),
        index === 0 ? React.createElement(DatasetsTab, null) : null,
        index === 1 ? React.createElement(SessionsTab, null) : null,
        index === 2 ? React.createElement(ToursTab, null) : null)))));
}
//# sourceMappingURL=StartMenuReact.js.map