import * as React from 'react';
import { useDrop } from 'react-dnd';
import { addView, useAppDispatch, useAppSelector } from '../../..';
import { EDragTypes } from '../utils';
export function WorkbenchLeftIcon({ view }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: [EDragTypes.ADD, EDragTypes.MOVE],
        drop: () => {
            dispatch(addView({
                workbenchIndex: ordino.focusViewIndex,
                view: {
                    id: '',
                    uniqueId: (Math.random() + 1).toString(36).substring(7),
                    filters: [],
                },
            }));
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), []);
    return (React.createElement("div", { ref: drop, className: `position-absolute d-flex align-items-center justify-content-center ${isOver ? 'bg-primary' : ''}`, style: {
            height: '100%',
            width: '33%',
            zIndex: 10,
        } },
        React.createElement("div", { className: "text-center" },
            React.createElement("i", { className: "fas fa-bars display-1 opacity-100", style: { color: 'cornflowerblue' } }))));
}
//# sourceMappingURL=WorkbenchLeftIcon.js.map