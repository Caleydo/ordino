import * as React from "react";
import { UniqueIdManager } from "phovea_core";
import { DetailViewFilter } from "./chooser/DetailViewFilter";
import { SelectedViewIndicator } from "./chooser/SelectedViewIndicator";
import { BurgerMenu } from "./chooser/BurgerMenu";
import { SelectionCountIndicator } from "./chooser/SelectionCountIndicator";
import { EViewMode } from "tdp_core";
import { groupBy } from "lodash";
export function DetailViewChooser(props) {
    var _a;
    // TODO bootstrap js not working
    // TODO split into smaller components
    const [filteredViews, setFilteredViews] = React.useState(props.views);
    const uniqueSuffix = UniqueIdManager.getInstance().uniqueId();
    const groupedViews = groupBy(filteredViews, (view) => view.group.name);
    console.log("rerendering");
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: `detail-view-chooser d-flex flex-column m-1 border border-gray ${props.embedded ? "embedded" : "overlay"}` },
            React.createElement("header", { className: "d-flex my-2 px-2 justify-content-center align-items-center" },
                React.createElement(BurgerMenu, { onClick: () => props.setEmbedded(!props.embedded) }),
                React.createElement(DetailViewFilter, { views: props.views, setFilteredViews: setFilteredViews })),
            !props.embedded && (React.createElement("main", { className: "selected-view-wrapper mt-2 d-flex flex-column justify-content-center align-items-center" },
                React.createElement(SelectionCountIndicator, { selectionCount: 5, viewMode: EViewMode.FOCUS, idType: "Cellines" }),
                React.createElement(SelectedViewIndicator, { selectedView: (_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.name, availableViews: props.views.length }))),
            React.createElement("main", { className: "view-buttons flex-row overflow-auto border-top border-gray" },
                React.createElement("div", { className: "accordion" }, Object.keys(groupedViews).map((v, i) => (React.createElement("div", { className: "accordion-item", key: i },
                    React.createElement("h2", { className: "accordion-header", id: v },
                        React.createElement("button", { className: "accordion-button btn-text-gray", type: "button", "data-bs-toggle": "collapse", "data-bs-target": `#collapse-${i}-${uniqueSuffix}`, "aria-expanded": "true", "aria-controls": `collapse-${i}-${uniqueSuffix}` }, v)),
                    React.createElement("div", { id: `collapse-${i}-${uniqueSuffix}`, className: "accordion-collapse collapse show", "aria-labelledby": v },
                        React.createElement("div", { className: "accordion-body d-grid gap-2" }, groupedViews[v].map((view, idx) => (React.createElement("button", { className: "btn btn-text-gray text-start", key: idx, onClick: () => props.onSelectedView(view, props.index) }, view.name)))))))))))));
}
//# sourceMappingURL=DetailViewChooser.js.map