import * as React from 'react';
import { EViewMode } from 'tdp_core';
import { chooserComponents } from './components';
export var ECollapseDirection;
(function (ECollapseDirection) {
    ECollapseDirection["LEFT"] = "left";
    ECollapseDirection["RIGHT"] = "right";
})(ECollapseDirection || (ECollapseDirection = {}));
export function ViewChooser({ views, onSelectedView, selectedView, showBurgerMenu = true, showFilter = true, showHeader = true, collapseDirection = ECollapseDirection.LEFT, extensions: { ViewChooserHeader, BurgerButton, SelectedViewIndicator, SelectionCountIndicator, ViewChooserAccordion, ViewChooserFilter, ViewChooserFooter } = chooserComponents }) {
    const [collapsed, setCollapsed] = React.useState(true);
    const [embedded, setEmbedded] = React.useState(false);
    const [filteredViews, setFilteredViews] = React.useState(views);
    const ref = React.useRef(null);
    React.useEffect(() => {
        setCollapsed(!embedded);
    }, [embedded]);
    return (React.createElement(React.Fragment, null,
        " ",
        React.createElement("div", { className: `view-chooser d-flex flex-shrink-0 align-items-stretch ${collapsed ? 'collapsed' : ''} ${embedded ? 'embedded' : ''}
      ${!embedded ? collapseDirection || ECollapseDirection.LEFT : ''}`, onMouseEnter: () => {
                if (embedded) {
                    return;
                }
                setCollapsed(false);
            }, onMouseLeave: (evt) => {
                if (embedded) {
                    return;
                }
                setCollapsed(true);
            } },
            React.createElement("div", { ref: ref, className: "view-chooser-content d-flex flex-column justify-content-stretch" },
                showHeader && React.createElement(ViewChooserHeader, null,
                    showBurgerMenu && React.createElement(BurgerButton, { onClick: () => setEmbedded(!embedded) }),
                    (!collapsed && showFilter) && React.createElement(ViewChooserFilter, { views: views, setFilteredViews: setFilteredViews })),
                collapsed ?
                    React.createElement("div", { className: "selected-view-wrapper flex-grow-1 mt-2 d-flex flex-column justify-content-start align-items-center" },
                        React.createElement(SelectionCountIndicator, { selectionCount: 5, viewMode: EViewMode.FOCUS, idType: "Cellines" }),
                        React.createElement(SelectedViewIndicator, { selectedView: selectedView === null || selectedView === void 0 ? void 0 : selectedView.name, availableViews: views.length })) :
                    React.createElement(ViewChooserAccordion, { views: filteredViews, selectedView: selectedView, onSelectedView: onSelectedView }),
                React.createElement(ViewChooserFooter, null)))));
}
//# sourceMappingURL=ViewChooser.js.map