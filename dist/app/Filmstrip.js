import * as React from 'react';
import { useMemo } from 'react';
import { EWorkbenchType, Workbench } from './Workbench';
import { useAppSelector } from '../hooks';
export const focusViewWidth = 85; // viewport width (vw)
export const contextViewWidth = 15; // viewport width (vw)
export function Filmstrip() {
    const ordino = useAppSelector((state) => state.ordino);
    const translateDistance = useMemo(() => {
        if (ordino.focusViewIndex > 1) {
            return `translateX(${(ordino.focusViewIndex - 1) * -contextViewWidth}vw)`;
        }
        return `translateX(0vw)`;
    }, [ordino.focusViewIndex]);
    return (React.createElement("div", { className: "ordino-filmstrip flex-grow-1 align-content-stretch", style: { transform: translateDistance } }, ordino.workbenches.map((v, index) => {
        const focused = ordino.focusViewIndex;
        return (React.createElement(Workbench, { type: v.index === focused - 1
                ? EWorkbenchType.CONTEXT
                : v.index === focused
                    ? EWorkbenchType.FOCUS
                    : v.index > focused
                        ? EWorkbenchType.NEXT
                        : EWorkbenchType.PREVIOUS, workbench: v, 
            // eslint-disable-next-line react/no-array-index-key
            key: index }));
    })));
}
//# sourceMappingURL=Filmstrip.js.map