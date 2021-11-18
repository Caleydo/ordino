import React from 'react';
import { useAppDispatch, useAppSelector } from '../../..';
import { setActiveTab } from '../../../store';
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
export function StartMenuTabWrapper(props) {
    const ordinoState = useAppSelector((state) => state.ordino);
    const menu = useAppSelector((state) => state.menu);
    const dispatch = useAppDispatch();
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "ordino-start-menu", className: `ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : 'd-none'} ${props.mode === EStartMenuMode.OVERLAY ? 'ordino-start-menu-overlay' : ''}` }, props.tabs.map(({ id, Tab }) => (React.createElement("div", { className: `tab-pane fade ${props.activeTab === id ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`, key: id, id: id, role: "tabpanel", "aria-labelledby": `${id}-tab` },
            props.mode === EStartMenuMode.OVERLAY &&
                React.createElement("div", { className: "container-fluid" },
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col position-relative d-flex justify-content-end" },
                            React.createElement("button", { className: "btn-close", onClick: () => { dispatch(setActiveTab(null)); } })))),
            React.createElement(Tab, null)))))));
}
//# sourceMappingURL=StartMenuTabWrapper.js.map