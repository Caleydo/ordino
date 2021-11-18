import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ETabStates, setActiveTab } from '../../../store';
import { EStartMenuMode } from './StartMenu';
export function StartMenuLinks(props) {
    const ordinoState = useSelector((state) => state.ordino);
    const dispatch = useDispatch();
    return (React.createElement(React.Fragment, null, props.tabs.map((tab) => (React.createElement("li", { className: `nav-item ${ordinoState.activeTab === tab.id ? 'active' : ''}`, key: tab.id },
        React.createElement("a", { className: "nav-link", href: `#${tab.id}`, id: `${tab.id}-tab`, role: "tab", "aria-controls": tab.id, "aria-selected": (ordinoState.activeTab === tab.id), onClick: (evt) => {
                evt.preventDefault();
                if (props.mode === EStartMenuMode.OVERLAY && ordinoState.activeTab === tab.id) {
                    // remove :focus from link to remove highlight color
                    evt.currentTarget.blur();
                    // close tab only in overlay mode
                    dispatch(setActiveTab({
                        activeTab: ETabStates.NONE
                    }));
                }
                else {
                    dispatch(setActiveTab({
                        activeTab: tab.id
                    }));
                }
                return false;
            } },
            tab.desc.icon ? React.createElement("i", { className: tab.desc.icon }) : null,
            tab.desc.text))))));
}
//# sourceMappingURL=StartMenuLinks.js.map