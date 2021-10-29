import * as React from 'react';
import { useSelector } from 'react-redux';
import { Workbench } from './Workbench';
export var EWorkbenchType;
(function (EWorkbenchType) {
    EWorkbenchType["PREVIOUS"] = "t-previous";
    EWorkbenchType["FOCUS"] = "t-focus";
    EWorkbenchType["FOCUS_CHOOSER"] = "t-focus-chooser";
    EWorkbenchType["CONTEXT"] = "t-context";
    EWorkbenchType["NEXT"] = "t-next";
})(EWorkbenchType || (EWorkbenchType = {}));
export function Filmstrip() {
    const ordino = useSelector((state) => state.ordino);
    const isLastFocused = ordino.focusViewIndex === ordino.views.length - 1;
    return (React.createElement("div", { className: "ordino-filmstrip" }, ordino.views.map((v) => {
        let type = EWorkbenchType.PREVIOUS;
        let styles = {};
        if (ordino.focusViewIndex === v.index + 1) {
            type = EWorkbenchType.CONTEXT;
        }
        else if (ordino.focusViewIndex === v.index) {
            type = EWorkbenchType.FOCUS;
            if (ordino.focusViewIndex === 0) {
                styles = { marginLeft: `calc(${ordino.focusViewIndex * -1}*100vw)` };
            }
        }
        else if (v.index > ordino.focusViewIndex) {
            type = EWorkbenchType.NEXT;
        }
        if (v.index === 0 && ordino.focusViewIndex !== v.index) {
            styles = v.index === 0 ? { marginLeft: `calc(${ordino.focusViewIndex * -1} * 100vw + 100vw)` } : {};
        }
        return (React.createElement(Workbench, { type: type, style: styles, view: v, key: v.id }));
    })));
}
//# sourceMappingURL=Filmstrip.js.map