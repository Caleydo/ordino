import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { EStartMenuMode, setActiveTab } from '../../store/menuSlice';
export function StartMenuTabWrapper(props) {
    const dispatch = useAppDispatch();
    return (React.createElement("div", { id: "ordino-start-menu", className: `ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : 'd-none'} ${props.mode === EStartMenuMode.OVERLAY ? 'ordino-start-menu-overlay' : ''}` }, props.tabs.map(({ id, Tab }) => (React.createElement("div", { className: `tab-pane fade ${props.activeTab === id ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`, key: id, id: id, role: "tabpanel", "aria-labelledby": `${id}-tab` },
        props.mode === EStartMenuMode.OVERLAY && (React.createElement("div", { className: "container-fluid" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col position-relative d-flex justify-content-end" },
                    React.createElement("button", { type: "button", className: "btn-close", onClick: () => {
                            dispatch(setActiveTab(null));
                        } }))))),
        React.createElement(Tab, null))))));
}
//# sourceMappingURL=StartMenuTabWrapper.js.map