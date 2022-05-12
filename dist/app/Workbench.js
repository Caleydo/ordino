import React, { useRef, useState } from 'react';
import { useAppSelector } from '../hooks';
import { EWorkbenchType, WorkbenchViews } from './workbench/WorkbenchViews';
export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }) {
    const ordino = useAppSelector((state) => state.ordino);
    const ref = useRef(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    React.useEffect(() => {
        console.log('adding event listener');
        if (ref === null || ref === void 0 ? void 0 : ref.current) {
            console.log(ref.current, ref);
            ref.current.addEventListener('transitionstart', (event) => {
                if (event.target === event.currentTarget) {
                    setIsTransitioning(true);
                }
            });
            ref.current.addEventListener('transitionend', (event) => {
                if (event.target === event.currentTarget) {
                    setTimeout(() => {
                        setIsTransitioning(false);
                    }, 2000);
                }
            });
        }
    }, [ref]);
    return (React.createElement("div", { ref: ref, className: `d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusWorkbenchIndex === 0 ? 'start' : ''}`, style: { borderTopColor: ordino.colorMap[workbench.entityId] } },
        React.createElement(WorkbenchViews, { isTransitioning: isTransitioning, index: workbench.index, type: type })));
}
//# sourceMappingURL=Workbench.js.map