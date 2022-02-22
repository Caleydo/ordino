import React from 'react';
import { useAppSelector } from '../hooks';
import { colorPalette } from './Breadcrumb';
import { WorkbenchViews } from './workbench/WorkbenchViews';
export var EWorkbenchType;
(function (EWorkbenchType) {
    EWorkbenchType["PREVIOUS"] = "t-previous";
    EWorkbenchType["FOCUS"] = "t-focus";
    EWorkbenchType["CONTEXT"] = "t-context";
    EWorkbenchType["NEXT"] = "t-next";
})(EWorkbenchType || (EWorkbenchType = {}));
export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }) {
    const ordino = useAppSelector((state) => state.ordino);
    const ref = React.useRef(null);
    return (React.createElement("div", { ref: ref, className: `d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusViewIndex === 0 ? 'start' : ''}`, style: { borderTopColor: colorPalette[workbench.index] } },
        React.createElement(WorkbenchViews, { index: workbench.index, onlyRanking: type === EWorkbenchType.CONTEXT })));
}
//# sourceMappingURL=Workbench.js.map