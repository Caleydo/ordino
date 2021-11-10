import * as React from 'react';
import { useDrop } from 'react-dnd';
import { addView, useAppDispatch, useAppSelector } from '../../..';
import { EViewDirections } from '../../../store';
import { EDragTypes } from '../utils';
export function WorkbenchRightIcon({ view }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: EDragTypes.ADD,
        drop: () => {
            console.log('droppin in bottom');
            dispatch(addView({
                workbenchId: ordino.focusViewIndex,
                direction: EViewDirections.E,
                parentId: view.id,
                view: {
                    directionFromParent: EViewDirections.E,
                    children: [],
                    id: (Math.random() + 1).toString(36).substring(7),
                    index: 0,
                    name: 'Start view',
                    selection: 'multiple',
                    selections: [],
                    group: {
                        name: 'General',
                        order: 10
                    }
                }
            }));
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), []);
    return (React.createElement("div", { ref: drop, className: `position-absolute d-flex align-items-center justify-content-center ${isOver ? 'bg-primary' : ''}`, style: {
            height: '100%',
            width: '33%',
            right: 0,
            zIndex: 10,
        } },
        React.createElement("div", { className: "text-center" },
            React.createElement("i", { className: "fas fa-bars display-1 opacity-100", style: { color: 'cornflowerblue' } }))));
}
//# sourceMappingURL=WorkbenchRightIcon.js.map