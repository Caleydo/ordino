import * as React from 'react';
export function SelectedViewIndicator(props) {
    return (React.createElement("div", { className: "selected-view-indicator flex-grow-1 fs-4 text-secondary m-0 d-flex align-items-center justify-content-center" }, props.selectedView || `${props.availableViews} Available views`));
}
//# sourceMappingURL=SelectedViewIndicator.js.map