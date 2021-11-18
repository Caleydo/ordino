import { debounce } from 'lodash';
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
    const ref = React.useRef(null);
    const onScrollTo = React.useCallback(debounce((contextRef) => {
        var _a;
        ref.current.scrollTo({ left: ((_a = contextRef === null || contextRef === void 0 ? void 0 : contextRef.current) === null || _a === void 0 ? void 0 : _a.offsetLeft) || 0, behavior: 'smooth' });
    }, 500), []);
    return (React.createElement("div", { ref: ref, className: "ordino-filmstrip w-100 flex-grow-1 position-relative d-flex align-content-stretch overflow-auto", style: { scrollSnapType: 'x mandatory' } }, ordino.workbenches.map((v) => {
        const focused = ordino.focusViewIndex;
        return (React.createElement(Workbench, { type: v.index === focused - 1 ? EWorkbenchType.CONTEXT : v.index === focused ? EWorkbenchType.FOCUS : v.index > focused ? EWorkbenchType.NEXT : EWorkbenchType.PREVIOUS, workbench: v, key: v.index, onScrollTo: onScrollTo }));
    })));
}
//# sourceMappingURL=Filmstrip.js.map