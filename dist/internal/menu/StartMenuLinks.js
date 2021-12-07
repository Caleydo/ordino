import React from 'react';
import { EStartMenuMode } from './StartMenu';
export function StartMenuLinks(props) {
    return (React.createElement(React.Fragment, null, props.status === 'success' && props.tabs.map((tab) => (React.createElement("li", { className: `nav-item ${props.activeTab === tab ? 'active' : ''}`, key: tab.desc.id },
        React.createElement("a", { className: "nav-link", href: `#${tab.desc.id}`, id: `${tab.desc.id}-tab`, "data-testid": `${tab.desc.id}-tab`, role: "tab", "aria-controls": tab.desc.id, "aria-selected": (props.activeTab === tab), onClick: (evt) => {
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
//# sourceMappingURL=StartMenuLinks.js.map