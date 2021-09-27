import React from 'react';
import { AView } from 'tdp_core';
export function OrdinoViewWrapper({ graph, wrapper, children, onSelectionChanged }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        wrapper.getInstance().on(AView.EVENT_ITEM_SELECT, (_, oldSelection, newSelection) => {
            // TODO: wrapper has not changed yet ignore itemSelection
            if (!(oldSelection.range.isNone && newSelection.range.isNone)) {
                onSelectionChanged(wrapper, oldSelection, newSelection);
            }
        });
        return () => {
            wrapper.getInstance().off(AView.EVENT_ITEM_SELECT, () => null);
            FormElementTyp;
        };
    }, [wrapper]);
    React.useEffect(() => {
        ref.current.appendChild(wrapper.node);
    }, [wrapper]);
    return React.createElement("div", { className: "viewWrapper", ref: ref }, children && React.createElement("div", null, children));
}
//# sourceMappingURL=OrdinoViewWrapper.js.map