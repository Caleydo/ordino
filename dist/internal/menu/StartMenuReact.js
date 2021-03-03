import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GlobalEventHandler } from 'phovea_core';
import { Ordino } from '../..';
import { DatasetsTab, SessionsTab, ToursTab } from './tabs';
const tabs = [
    { id: 'datasets', title: 'Datasets' },
    { id: 'sessions', title: 'Analysis Sessions' },
    { id: 'tours', title: 'Tours' },
];
// tslint:disable-next-line: variable-name
export const GraphContext = React.createContext({ graph: null, manager: null, app: null });
export function StartMenuComponent({ headerMainMenu, manager, graph, app }) {
    const [active, setActive] = React.useState(null);
    React.useEffect(() => {
        const listener = () => setActive(tabs[0]);
        GlobalEventHandler.getInstance().on(Ordino.EVENT_OPEN_START_MENU, listener);
        return () => {
            GlobalEventHandler.getInstance().off(Ordino.EVENT_OPEN_START_MENU, listener);
        };
    }, []);
    return (React.createElement(React.Fragment, null,
        ReactDOM.createPortal(React.createElement(MainMenuLinks, { tabs: tabs, active: active, setActive: (a) => setActive(a) }), headerMainMenu),
        React.createElement(GraphContext.Provider, { value: { manager, graph, app } },
            React.createElement(StartMenu, { tabs: tabs, active: active, setActive: setActive }))));
}
function MainMenuLinks(props) {
    return (React.createElement(React.Fragment, null, props.tabs.map((tab) => (React.createElement("li", { className: "nav-item", key: tab.id },
        React.createElement("a", { className: "nav-link", href: `#${tab.id}`, id: `${tab.id}-tab`, role: "tab", "aria-controls": tab.id, "aria-selected": (props.active === tab), onClick: (evt) => {
                evt.preventDefault();
                window.scrollTo(0, 0);
                if (props.active === tab) {
                    props.setActive(null);
                }
                else {
                    props.setActive(tab);
                }
                return false;
            } }, tab.title))))));
}
function StartMenu(props) {
    return (React.createElement("div", { className: `ordino-start-menu tab-content ${props.active ? 'ordino-start-menu-open' : ''}` }, props.tabs.map((tab, index) => (React.createElement("div", { className: `tab-pane fade ${props.active === tab ? `active show` : ''}`, key: tab.id, id: tab.id, role: "tabpanel", "aria-labelledby": `${tab.id}-tab` },
        index === 0 ? React.createElement(DatasetsTab, null) : null,
        index === 1 ? React.createElement(SessionsTab, null) : null,
        index === 2 ? React.createElement(ToursTab, null) : null)))));
}
//# sourceMappingURL=StartMenuReact.js.map