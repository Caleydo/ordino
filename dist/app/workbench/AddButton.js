import React from 'react';
import { EDragTypes } from './utils';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../..';
export function AddButton() {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: EDragTypes.ADD,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    return (React.createElement("button", { ref: drag, type: "button", className: "btn btn-primary" }, "Add View"));
}
// onClick={() => {
//     dispatch(addView({
//         workbenchIndex: ordino.focusViewIndex,
//         view: {
//             id: 'view_0',
//             index: 0,
//             name: 'Start view',
//             selection: 'multiple',
//             selections: [],
//             group: {
//                 name: 'General',
//                 order: 10
//             }
//             }
//     }));
// }}
//# sourceMappingURL=AddButton.js.map