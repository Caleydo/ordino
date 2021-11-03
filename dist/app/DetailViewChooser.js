import * as React from 'react';
import { UniqueIdManager } from 'phovea_core';
import { DetailViewFilter } from './chooser/DetailViewFilter';
import { SelectedViewIndicator } from './chooser/SelectedViewIndicator';
import { BurgerMenu } from './chooser/BurgerMenu';
import { SelectionCountIndicator } from './chooser/SelectionCountIndicator';
import { EViewMode } from 'tdp_core';
import { groupBy } from 'lodash';
import { ChooserFooter } from './chooser/ChooserFooter';
export function DetailViewChooser(props) {
    var _a;
    // TODO split into smaller components
    const [filteredViews, setFilteredViews] = React.useState(props.views);
    const uniqueSuffix = UniqueIdManager.getInstance().uniqueId();
    const groupedViews = groupBy(filteredViews, (view) => view.group.name);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: `detail-view-chooser d-flex flex-column justify-content-stretch m-1 rounded-1 ${props.embedded ? 'embedded' : 'overlay'}` },
            React.createElement("header", { className: "d-flex my-2 px-1 justify-content-center align-items-center" },
                React.createElement(BurgerMenu, { onClick: () => props.setEmbedded(!props.embedded) }),
                React.createElement(DetailViewFilter, { views: props.views, setFilteredViews: setFilteredViews })),
            !props.embedded && (React.createElement("div", { className: "selected-view-wrapper flex-grow-1 mt-2 d-flex flex-column justify-content-start align-items-center" },
                React.createElement(SelectionCountIndicator, { selectionCount: 5, viewMode: EViewMode.FOCUS, idType: "Cellines" }),
                React.createElement(SelectedViewIndicator, { selectedView: (_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.name, availableViews: props.views.length }))),
            React.createElement("div", { className: "view-buttons flex-grow-1 flex-row overflow-auto border-top border-light" },
                React.createElement("div", null, Object.keys(groupedViews).map((v, i) => (React.createElement("div", { className: "accordion-item", key: i },
                    React.createElement("h2", { className: "accordion-header d-flex", id: v },
                        React.createElement("button", { className: `accordion-button btn-text-gray py-2 ${groupedViews[v].some((v) => { var _a; return v.id === ((_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.id); }) ? 'selected-group' : ''}`, type: "button", "data-bs-toggle": "collapse", "data-bs-target": `#collapse-${i}-${uniqueSuffix}`, "aria-expanded": "true", "aria-controls": `collapse-${i}-${uniqueSuffix}` }, v)),
                    React.createElement("div", { id: `collapse-${i}-${uniqueSuffix}`, className: "accordion-collapse collapse show", "aria-labelledby": v },
                        React.createElement("div", { className: "accordion-body d-grid gap-2 px-0 py-1" }, groupedViews[v].map((view, idx) => {
                            var _a;
                            return (React.createElement("button", { className: `btn btn-text-gray py-1 ps-4 text-start ${view.id === ((_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.id) ? 'selected-view ' : ''}`, key: idx, onClick: () => props.onSelectedView(view, props.index) }, view.name));
                        })))))))),
            React.createElement(ChooserFooter, null))));
}
//# sourceMappingURL=DetailViewChooser.js.map