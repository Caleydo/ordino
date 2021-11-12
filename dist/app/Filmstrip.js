import * as React from 'react';
import { Workbench } from './Workbench';
import { useAppSelector } from '../hooks';
export var EWorkbenchType;
(function (EWorkbenchType) {
    EWorkbenchType["PREVIOUS"] = "t-previous";
    EWorkbenchType["FOCUS"] = "t-focus";
    EWorkbenchType["CONTEXT"] = "t-context";
    EWorkbenchType["NEXT"] = "t-next";
})(EWorkbenchType || (EWorkbenchType = {}));
export function Filmstrip() {
    const ordino = useAppSelector((state) => state.ordino);
    const isLastFocused = ordino.focusViewIndex === ordino.workbenches.length - 1;
    return (React.createElement("div", { className: "ordino-filmstrip" }, ordino.workbenches.map((w) => {
        let type = EWorkbenchType.PREVIOUS;
        let styles = {};
        if (ordino.focusViewIndex === w.index + 1) {
            type = EWorkbenchType.CONTEXT;
        }
        else if (ordino.focusViewIndex === w.index) {
            type = EWorkbenchType.FOCUS;
            if (ordino.focusViewIndex === 0) {
                styles = { marginLeft: `calc(${ordino.focusViewIndex * -1}*100vw)` };
            }
        }
        else if (w.index > ordino.focusViewIndex) {
            type = EWorkbenchType.NEXT;
        }
        if (w.index === 0 && ordino.focusViewIndex !== w.index) {
            styles = w.index === 0 ? { marginLeft: `calc(${ordino.focusViewIndex * -1} * 100vw + 100vw)` } : {};
        }
        return (React.createElement(Workbench, { type: type, style: styles, workbench: w, key: `wb${w.index}` }));
    })));
}
//# sourceMappingURL=Filmstrip.js.map