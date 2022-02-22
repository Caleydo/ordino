import * as React from 'react';
import { useAppDispatch } from '../../hooks';
import { EStartMenuMode, setActiveTab } from '../../store';
export function HeaderTabs(props) {
    const dispatch = useAppDispatch();
    return (React.createElement("ul", { className: "navbar-nav me-auto align-items-center" }, props.tabs.map((tab) => (React.createElement("li", { className: `nav-item ${props.activeTab === tab.id ? 'active' : ''}`, key: tab.id },
        React.createElement("a", { className: "nav-link", href: `#${tab.id}`, id: `${tab.id}-tab`, role: "tab", "aria-controls": tab.id, "aria-selected": props.activeTab === tab.id, onClick: (evt) => {
                evt.preventDefault();
                if (props.mode === EStartMenuMode.OVERLAY && props.activeTab === tab.id) {
                    // remove :focus from link to remove highlight color
                    evt.currentTarget.blur();
                    // close tab only in overlay mode
                    dispatch(setActiveTab(null));
                }
                else {
                    dispatch(setActiveTab(tab.id));
                }
                return false;
            } }, tab.name))))));
}
//# sourceMappingURL=HeaderTabs.js.map