import { groupBy } from 'lodash';
import { UniqueIdManager } from 'tdp_core';
import React from 'react';
export function ViewChooserAccordion(props) {
    const uniqueSuffix = UniqueIdManager.getInstance().uniqueId();
    const groups = groupBy(props.views, (view) => view.group.name);
    return React.createElement("div", { className: "view-buttons flex-grow-1 flex-row border-top border-light overflow-auto" }, Object.keys(groups).map((v, i) => (React.createElement("div", { className: `accordion-item ${i < Object.keys(groups).length - 1 ? 'border-0 border-bottom border-light' : ''}`, key: i },
        React.createElement("button", { className: `accordion-button py-2 btn-text-gray shadow-none text-nowrap ${groups[v].some((v) => { var _a; return v.id === ((_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.id); }) ? 'active' : ''}`, type: "button", "data-bs-toggle": "collapse", "data-bs-target": `#collapse-${i}-${uniqueSuffix}`, "aria-expanded": "true", "aria-controls": `collapse-${i}-${uniqueSuffix}` }, v),
        React.createElement("div", { id: `collapse-${i}-${uniqueSuffix}`, className: "collapse show", "aria-labelledby": v },
            React.createElement("div", { className: "d-grid gap-2 px-0 py-1" }, groups[v].map((view, idx) => {
                var _a;
                return (React.createElement("button", { className: `btn py-1 ps-4 text-start btn-text-gray shadow-none text-nowrap rounded-0 rounded-end me-1 ${view.id === ((_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.id) ? 'active' : ''}`, key: idx, onClick: () => props.onSelectedView(view) }, view.name));
            })))))));
}
//# sourceMappingURL=ViewChooserAccordion.js.map