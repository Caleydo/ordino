import * as React from 'react';
import { Workbench } from './Workbench';
import { useAppSelector } from '../hooks';
import { useMemo } from 'react';
export var EWorkbenchType;
(function (EWorkbenchType) {
    EWorkbenchType["PREVIOUS"] = "t-previous";
    EWorkbenchType["FOCUS"] = "t-focus";
    EWorkbenchType["CONTEXT"] = "t-context";
    EWorkbenchType["NEXT"] = "t-next";
})(EWorkbenchType || (EWorkbenchType = {}));
export const focusViewWidth = 85;
export const contextViewWidth = 15;
export function Filmstrip() {
    const ordino = useAppSelector((state) => state.ordino);
    const ref = React.useRef(null);
    const translateDistance = useMemo(() => {
        const contextIndex = ordino.focusViewIndex - 1;
        if (ordino.focusViewIndex > 1) {
            return `translateX(${(ordino.focusViewIndex - 1) * -contextViewWidth}vw)`;
        }
        else {
            return `translateX(0vw)`;
        }
    }, [ordino.focusViewIndex]);
    return (React.createElement("div", { ref: ref, className: "ordino-filmstrip flex-grow-1 align-content-stretch", style: { transform: translateDistance } }, ordino.workbenches.map((v, index) => {
        const focused = ordino.focusViewIndex;
        return (React.createElement(Workbench, { type: v.index === focused - 1 ? EWorkbenchType.CONTEXT : v.index === focused ? EWorkbenchType.FOCUS : v.index > focused ? EWorkbenchType.NEXT : EWorkbenchType.PREVIOUS, workbench: v, key: index }));
    })));
}
//# sourceMappingURL=Filmstrip.js.map