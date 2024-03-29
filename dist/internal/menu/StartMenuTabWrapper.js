import React from 'react';
import { EStartMenuMode } from '../constants';
export function StartMenuTabWrapper(props) {
    return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, props.status === 'success' && (React.createElement("div", { id: "ordino-start-menu", className: `ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : 'd-none'} ${props.mode === EStartMenuMode.OVERLAY ? 'ordino-start-menu-overlay' : ''}` }, props.tabs.map((tab) => (React.createElement("div", { className: `tab-pane fade ${props.activeTab === tab ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`, key: tab.desc.id, id: tab.desc.id, role: "tabpanel", "aria-labelledby": `${tab.desc.id}-tab`, "data-testid": tab.desc.id },
        props.mode === EStartMenuMode.OVERLAY && (React.createElement("div", { className: "container-fluid" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col position-relative d-flex justify-content-end" },
                    React.createElement("button", { type: "button", className: "btn-close", "data-testid": "close-button", onClick: () => {
                            props.setActiveTab(null);
                        } }))))),
        React.createElement(tab.factory, { isActive: props.activeTab === tab }))))))));
}
//# sourceMappingURL=StartMenuTabWrapper.js.map