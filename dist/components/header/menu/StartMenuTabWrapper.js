import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ETabStates, setActiveTab } from '../../../store';
import DatasetsTab from './tabs/DatasetsTab';
export function StartMenuTabWrapper({ tabs = [{ id: ETabStates.DATASETS, tab: React.createElement(DatasetsTab, null) }], mode = 'overlay' }) {
    const ordinoState = useSelector((state) => state.ordino);
    const dispatch = useDispatch();
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "ordino-start-menu", className: `ordino-start-menu tab-content ${ordinoState.activeTab !== ETabStates.NONE ? 'ordino-start-menu-open' : 'd-none'} ${mode === 'overlay' ? 'ordino-start-menu-overlay' : ''}` }, tabs.map((tab) => (React.createElement("div", { className: `tab-pane fade ${ordinoState.activeTab === tab.id ? `active show` : ''} ${mode === 'start' ? `pt-5` : ''}`, key: tab.id, id: tab.id, role: "tabpanel", "aria-labelledby": `${tab.id}-tab` },
            mode === 'overlay' &&
                React.createElement("div", { className: "container-fluid" },
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col position-relative d-flex justify-content-end" },
                            React.createElement("button", { className: "btn-close", onClick: () => dispatch(setActiveTab({
                                    activeTab: ETabStates.NONE
                                })) })))),
            tab.tab))))));
}
//# sourceMappingURL=StartMenuTabWrapper.js.map