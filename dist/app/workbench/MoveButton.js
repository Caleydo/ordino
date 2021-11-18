import React from 'react';
import { EDragTypes } from './utils';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../..';
export function MoveButton({ view }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.MOVE,
        item: { type: EDragTypes.MOVE, viewId: view.id, index: view.index },
    }), [view.id, view.index]);
    return (React.createElement("button", { ref: drag, type: "button", className: "position-absolute btn btn-primary" }, "Move View"));
}
//# sourceMappingURL=MoveButton.js.map