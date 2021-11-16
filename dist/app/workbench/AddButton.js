import React from 'react';
import { EDragTypes } from './utils';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../..';
export function AddButton() {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.ADD,
        item: { type: EDragTypes.ADD },
    }));
    return (React.createElement("button", { ref: drag, type: "button", className: "btn btn-primary" }, "Add View"));
}
//# sourceMappingURL=AddButton.js.map