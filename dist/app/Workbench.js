import React from 'react';
import { EWorkbenchType } from './Filmstrip';
import { useAppDispatch, useAppSelector } from '../hooks';
import { WorkbenchViews } from './workbench/WorkbenchViews';
export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const ref = React.useRef(null);
    return (React.createElement("div", { ref: ref, className: `d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusViewIndex === 0 ? 'start' : ''}`, style: { borderTopColor: ordino.colorMap[workbench.entityId] } },
        React.createElement(WorkbenchViews, { index: workbench.index, onlyRanking: type === EWorkbenchType.CONTEXT })));
}
//# sourceMappingURL=Workbench.js.map