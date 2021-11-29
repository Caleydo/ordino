import * as React from 'react';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../..';
import { removeView } from '../../store';
import { DropOverlay } from './DropOverlay';
import { useLoadViewPlugin } from './useLoadViewPlugin';
import { EDragTypes } from './utils';
export function WorkbenchSingleView({ view }) {
    const [ref, instance] = useLoadViewPlugin(view.id);
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: [EDragTypes.MOVE],
        canDrop: (d) => {
            return d.viewId !== view.id;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [view.id]);
    return (React.createElement("div", { ref: drop, className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" },
        React.createElement("div", { className: "view-actions" },
            React.createElement("button", { type: "button", onClick: () => dispatch(removeView({ workbenchIndex: ordino.focusViewIndex, viewIndex: view.index })), className: "btn-close" })),
        React.createElement("div", { className: "view-parameters" }),
        React.createElement("div", { ref: ref, className: "inner" }),
        isOver && canDrop ? React.createElement(DropOverlay, { view: view }) : null));
}
//# sourceMappingURL=WorkbenchSingleView.js.map