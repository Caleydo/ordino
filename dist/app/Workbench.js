import React from 'react';
import { useAppSelector } from '../hooks';
import { EWorkbenchType, WorkbenchViews } from './workbench/WorkbenchViews';
export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }) {
    const ordino = useAppSelector((state) => state.ordino);
    return (React.createElement("div", { className: `d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusWorkbenchIndex === 0 ? 'start' : ''}`, style: { borderTopColor: ordino.colorMap[workbench.entityId] } },
        React.createElement(WorkbenchViews, { index: workbench.index, type: type })));
}
//# sourceMappingURL=Workbench.js.map