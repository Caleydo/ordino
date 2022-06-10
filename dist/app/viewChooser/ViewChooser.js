import * as React from 'react';
import { EViewMode } from 'tdp_core';
import { chooserComponents } from './config';
export var EViewChooserMode;
(function (EViewChooserMode) {
    EViewChooserMode[EViewChooserMode["EMBEDDED"] = 0] = "EMBEDDED";
    EViewChooserMode[EViewChooserMode["OVERLAY"] = 1] = "OVERLAY";
})(EViewChooserMode || (EViewChooserMode = {}));
export var EExpandMode;
(function (EExpandMode) {
    EExpandMode[EExpandMode["LEFT"] = 0] = "LEFT";
    EExpandMode[EExpandMode["RIGHT"] = 1] = "RIGHT";
})(EExpandMode || (EExpandMode = {}));
export function ViewChooser({ views, onSelectedView, selectedView, showBurgerMenu = true, showFilter = true, showHeader = true, showFooter = true, mode = EViewChooserMode.EMBEDDED, expand = EExpandMode.RIGHT, classNames = '', extensions: { ViewChooserHeader = chooserComponents.ViewChooserHeader, BurgerButton = chooserComponents.BurgerButton, SelectedViewIndicator = chooserComponents.SelectedViewIndicator, SelectionCountIndicator = chooserComponents.SelectionCountIndicator, ViewChooserAccordion = chooserComponents.ViewChooserAccordion, ViewChooserFilter = chooserComponents.ViewChooserFilter, ViewChooserFooter = chooserComponents.ViewChooserFooter, } = {}, }) {
    const [collapsed, setCollapsed] = React.useState(mode !== EViewChooserMode.EMBEDDED);
    const [embedded, setEmbedded] = React.useState(mode === EViewChooserMode.EMBEDDED);
    const [filteredViews, setFilteredViews] = React.useState(views);
    React.useEffect(() => {
        setFilteredViews(views);
    }, [views]);
    React.useEffect(() => {
        setCollapsed(!embedded);
    }, [embedded]);
    const collapsedProps = embedded
        ? {}
        : {
            onMouseEnter: () => setCollapsed(false),
            onMouseLeave: () => setCollapsed(true),
        };
    return (React.createElement(React.Fragment, null,
        ' ',
        React.createElement("div", { className: `view-chooser  d-flex flex-shrink-0 align-items-stretch
       ${classNames}
       ${collapsed ? 'collapsed' : ''}
       ${embedded ? 'embedded' : ''}
       ${!embedded && !collapsed ? (expand === EExpandMode.RIGHT ? 'expand-right' : 'expand-left') : ''}`, ...collapsedProps },
            React.createElement("div", { className: `view-chooser-content bg-white d-flex flex-column justify-content-stretch ${!embedded && !collapsed ? 'shadow' : ''}` },
                showHeader && (React.createElement(ViewChooserHeader, null,
                    React.createElement("div", { className: "text-gray h4" }, "Add Views"),
                    showBurgerMenu ? React.createElement(BurgerButton, { onClick: () => setEmbedded(!embedded) }) : null,
                    !collapsed && showFilter ? React.createElement(ViewChooserFilter, { views: views, setFilteredViews: setFilteredViews }) : null)),
                collapsed ? (React.createElement("div", { className: "selected-view-wrapper flex-grow-1 mt-2 d-flex flex-column justify-content-start align-items-center" },
                    React.createElement(SelectionCountIndicator, { selectionCount: 5, viewMode: EViewMode.FOCUS, idType: "Cellines" }),
                    React.createElement(SelectedViewIndicator, { selectedView: selectedView === null || selectedView === void 0 ? void 0 : selectedView.name, availableViews: views.length }))) : (React.createElement(ViewChooserAccordion, { views: filteredViews, selectedView: selectedView, onSelectedView: onSelectedView })),
                showFooter ? React.createElement(ViewChooserFooter, null) : null))));
}
//# sourceMappingURL=ViewChooser.js.map