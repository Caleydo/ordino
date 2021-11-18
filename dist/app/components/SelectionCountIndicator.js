import React from 'react';
import { BSTooltip, EViewMode } from 'tdp_core';
export function SelectionCountIndicator({ selectionCount, viewMode = EViewMode.HIDDEN, idType = 'Genes' }) {
    const modeClass = viewMode === EViewMode.FOCUS ? 't-focus' : viewMode === EViewMode.CONTEXT ? 't-context' : '';
    return (React.createElement(React.Fragment, null,
        React.createElement(BSTooltip, null,
            React.createElement("div", { className: `${modeClass} selection-count-indicator d-flex justify-content-center align-items-center fs-5 mb-2 rounded-3`, title: `${selectionCount} ${idType} selected from previous view`, "data-bs-toggle": "tooltip" },
                React.createElement("span", { className: "text-secondary" },
                    " ",
                    selectionCount)))));
}
;
//# sourceMappingURL=SelectionCountIndicator.js.map