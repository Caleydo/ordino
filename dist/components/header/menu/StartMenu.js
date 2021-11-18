import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StartMenuLinks } from './StartMenuLinks';
import { StartMenuTabWrapper } from './StartMenuTabWrapper';
import { ETabStates } from '../../..';
import DatasetsTab from './tabs/DatasetsTab';
export var EStartMenuSection;
(function (EStartMenuSection) {
    /**
     * Main menu section in the header
     */
    EStartMenuSection["MAIN"] = "main";
    /**
     * Right menu section in the header
     */
    EStartMenuSection["RIGHT"] = "right";
})(EStartMenuSection || (EStartMenuSection = {}));
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
function byPriority(a, b) {
    return (a.priority || 10) - (b.priority || 10);
}
export function StartMenuComponent({ mode = EStartMenuMode.OVERLAY, open = EStartMenuOpen.CLOSED, tabs = [{ id: ETabStates.DATASETS, tab: React.createElement(DatasetsTab, null) }] }) {
    // no active tab until `open` is set OR a link in the header navigation is clicked
    const [activeTab, setActiveTab] = React.useState(null);
    const [highlight, setHighlight] = React.useState(false);
    return (React.createElement(React.Fragment, null,
        ReactDOM.createPortal(React.createElement(StartMenuLinks, { tabs: tabs, mode: mode }), document.getElementById("ordino-")),
        React.createElement(StartMenuTabWrapper, { tabs: tabs, mode: mode })));
}
//# sourceMappingURL=StartMenu.js.map