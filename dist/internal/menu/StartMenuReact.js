import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseUtils } from 'phovea_core';
// @ts-ignore
const StartMenuContext = React.createContext(null);
function StartMenuProvider({ children }) {
    const [open, setOpen] = React.useState(false);
    const [active, setActive] = React.useState(null);
    const store = {
        open,
        setOpen,
        active,
        setActive,
    };
    return (React.createElement(StartMenuContext.Provider, { value: store }, children));
}
export function StartMenuWrapper(parentElement, header) {
    let tabs = [
        { id: 'datasets', title: 'Datasets' },
        { id: 'sessions', title: 'Analysis Sessions' },
        { id: 'tours', title: 'Tours' },
    ];
    tabs = tabs.map((tab) => {
        tab.key = `${tab.id}-${BaseUtils.randomId(3)}`;
        return tab;
    });
    // TODO: two indpendent ReactDOM.render() seem to be odd -> is there a better way?
    ReactDOM.render(React.createElement(StartMenuProvider, null,
        React.createElement(MainMenuLinks, { tabs: tabs })), header.mainMenu);
    return ReactDOM.render(React.createElement(StartMenuProvider, null,
        React.createElement(StartMenu, { tabs: tabs })), parentElement);
}
function StartMenu(props) {
    const { open, active } = React.useContext(StartMenuContext);
    console.log(active, open);
    return (React.createElement("div", { className: `ordino-start-menu tab-content ${open ? 'ordino-start-menu-open' : ''}` }, props.tabs.map((tab) => (React.createElement("div", { className: `tab-pane fade ${active === tab ? `active show` : ''}`, id: tab.key, role: "tabpanel", "aria-labelledby": `${tab.key}-tab`, key: tab.id }, tab.title)))));
}
function MainMenuLinks(props) {
    const { active, setActive, open, setOpen } = React.useContext(StartMenuContext);
    return (React.createElement(React.Fragment, null, props.tabs.map((tab) => (React.createElement("li", { className: "nav-item", key: tab.key },
        React.createElement("a", { className: "nav-link", href: `#${tab.key}`, id: `${tab.key}-tab`, role: "tab", "aria-controls": tab.key, "aria-selected": (active === tab), onClick: (evt) => {
                evt.preventDefault();
                console.log(open, active);
                setOpen(!open);
                setActive(tab);
                return false;
            } }, tab.title))))));
}
//# sourceMappingURL=StartMenuReact.js.map