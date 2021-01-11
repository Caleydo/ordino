import * as React from 'react';
import * as ReactDOM from 'react-dom';
const tabs = [
    { id: 'datasets', title: 'Datasets' },
    { id: 'sessions', title: 'Analysis Sessions' },
    { id: 'tours', title: 'Tours' },
];
export function StartMenuComponent({ headerMainMenu }) {
    const [active, setActive] = React.useState(null);
    return (React.createElement(React.Fragment, null,
        ReactDOM.createPortal(React.createElement(MainMenuLinks, { tabs: tabs, active: active, setActive: setActive }), headerMainMenu),
        React.createElement(StartMenu, { tabs: tabs, active: active, setActive: setActive })));
}
function MainMenuLinks(props) {
    return (React.createElement(React.Fragment, null, props.tabs.map((tab) => (React.createElement("li", { className: "nav-item", key: tab.id },
        React.createElement("a", { className: "nav-link", href: `#${tab.id}`, id: `${tab.id}-tab`, role: "tab", "aria-controls": tab.id, "aria-selected": (props.active === tab), onClick: (evt) => {
                evt.preventDefault();
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
    return (React.createElement("div", { className: `ordino-start-menu tab-content ${props.active ? 'ordino-start-menu-open' : ''}` }, props.tabs.map((tab) => (React.createElement("div", { className: `tab-pane fade ${props.active === tab ? `active show` : ''}`, key: tab.id, id: tab.id, role: "tabpanel", "aria-labelledby": `${tab.id}-tab` }, tab.title)))));
}
//# sourceMappingURL=StartMenuReact.js.map