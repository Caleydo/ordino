import * as React from 'react';
import { useDrop } from 'react-dnd';
import { switchViews, useAppDispatch, useAppSelector } from '../../..';
import { EDragTypes } from '../utils';
export function WorkbenchSwitchIcon({ view }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: [EDragTypes.MOVE],
        drop: (d) => {
            console.log(d, view);
            dispatch(switchViews({ workbenchIndex: ordino.focusViewIndex, firstViewIndex: d.index, secondViewIndex: view.index }));
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [view.index]);
    return (React.createElement("div", { ref: drop, className: `position-absolute d-flex align-items-center justify-content-center`, style: {
            height: '100%',
            width: '100%',
            zIndex: 10,
        } },
        React.createElement("div", { className: "text-center" },
            React.createElement("i", { className: "fas fa-exchange-alt display-1 opacity-100", style: { color: 'black' } }))));
}
//# sourceMappingURL=WorkbenchSwitchIcon.js.map