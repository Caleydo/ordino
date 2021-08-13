import React from 'react';
export function StartMenuTabShortcuts({ tabs, shortcuts, setActiveTab, setHighlight, status }) {
    const onClick = (evt, shortcut) => {
        evt.preventDefault();
        setActiveTab(tabs.find((t) => t.desc.id === shortcut.tabId));
        if (shortcut.setHighlight) {
            setHighlight(true); // the value is set to `false` when the animation in `CommonSessionCard` ends
        }
    };
    return React.createElement(React.Fragment, null, status === 'success' && shortcuts.map((s) => {
        return React.createElement("li", { key: s.id, className: `nav-item` },
            React.createElement("a", { className: "nav-link", role: "button", onClick: (evt) => onClick(evt, s) },
                " ",
                s.icon ? React.createElement("i", { className: `me-2 ${s.icon}` }) : null,
                s.text));
    }));
}
//# sourceMappingURL=StartMenuTabShortcuts.js.map