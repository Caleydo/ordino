import React from 'react';
import { EDragTypes } from './utils';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../..';
import { findViewIndex } from '../../store/storeUtils';
export function MoveButton({ view }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.MOVE,
        item: { type: EDragTypes.MOVE, viewId: view.id, index: findViewIndex(view.uniqueId, ordino.workbenches[ordino.focusViewIndex]) },
    }), [view.id, ordino.workbenches[ordino.focusViewIndex].views]);
    return (React.createElement("button", { ref: drag, type: "button", className: "position-absolute btn btn-primary" }, "Move View"));
}
//# sourceMappingURL=MoveButton.js.map