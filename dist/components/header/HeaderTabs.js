import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ETabStates, setActiveTab } from '../../store';
export function HeaderTabs() {
    const ordinoState = useSelector((state) => state.ordino);
    const dispatch = useDispatch();
    return (React.createElement("ul", { className: "navbar-nav me-auto", "data-header": "mainMenu" },
        React.createElement("li", { className: `nav-item ${ordinoState.activeTab === ETabStates.DATASETS ? 'active' : ''}` },
            React.createElement("a", { className: "nav-link", href: "#ordino_dataset_tab", id: "ordino_dataset_tab-tab", role: "tab", "aria-controls": "ordino_dataset_tab", "aria-selected": "true", onClick: () => dispatch(setActiveTab({
                    activeTab: ETabStates.DATASETS
                })) }, "Datasets"))));
}
//# sourceMappingURL=HeaderTabs.js.map