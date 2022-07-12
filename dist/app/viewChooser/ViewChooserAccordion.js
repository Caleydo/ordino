import { groupBy } from 'lodash';
import { UniqueIdManager } from 'tdp_core';
import React from 'react';
import { isVisynRankingViewDesc } from '../../views';
import { BreadcrumbSvgPathOnly } from '../../components/breadcrumb/BreadcrumbSvgPathOnly';
const BREADCRUMB_WIDTH = 30;
export function ViewChooserAccordion(props) {
    const uniqueSuffix = UniqueIdManager.getInstance().uniqueId();
    const groups = groupBy(props.views, (view) => view.group.name);
    return (React.createElement("div", { className: "view-buttons flex-grow-1 flex-row border-top border-light overflow-auto" }, Object.keys(groups)
        .sort((a, b) => groups[a][0].group.order - groups[b][0].group.order)
        .map((v, i) => (
    // eslint-disable-next-line react/no-array-index-key
    React.createElement("div", { className: `accordion-item ${i < Object.keys(groups).length - 1 ? 'border-0 border-bottom border-light' : ''}`, key: i },
        React.createElement("button", { className: `accordion-button btn-text-gray py-2 shadow-none text-nowrap ${groups[v].some((g) => { var _a; return g.id === ((_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.id); }) ? 'active' : ''}`, type: "button", style: { fontWeight: 500, color: 'black' }, "data-bs-toggle": "collapse", "data-bs-target": `#collapse-${i}-${uniqueSuffix}`, "aria-expanded": "true", "aria-controls": `collapse-${i}-${uniqueSuffix}` }, v),
        React.createElement("div", { id: `collapse-${i}-${uniqueSuffix}`, className: "collapse show", "aria-labelledby": v },
            React.createElement("div", { className: "d-grid gap-2 px-0 py-1" }, groups[v].map((view, idx) => {
                var _a;
                return (React.createElement("button", { type: "button", className: `d-flex align-items-center btn-text-gray justify-content-between btn py-1 ps-4 pe-0 text-start shadow-none text-nowrap rounded-0 rounded-end ${view.id === ((_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.id) ? 'active' : ''}`, style: { color: 'black' }, 
                    // eslint-disable-next-line react/no-array-index-key
                    key: idx, onClick: () => props.onSelectedView(view) },
                    React.createElement("div", null, view.name),
                    isVisynRankingViewDesc(view) ? (React.createElement("div", { className: "d-flex h-100 align-items-center", style: { marginRight: '1.25rem', width: `1.25rem` } },
                        React.createElement(BreadcrumbSvgPathOnly, { color: view.color, width: BREADCRUMB_WIDTH, height: 18, isFirst: false }))) : view.icon ? (React.createElement("i", { className: `${view.icon}`, style: { marginRight: '1.25rem', fontSize: '16px', color: view.color } })) : null));
            }))))))));
}
//# sourceMappingURL=ViewChooserAccordion.js.map