import * as React from 'react';
import { useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { removeView } from '../../store';
import { findViewIndex } from '../../store/storeUtils';
import { DropOverlay } from './DropOverlay';
import { useLoadViewPlugin } from './useLoadViewPlugin';
import { EDragTypes } from './utils';
export function WorkbenchRankingView({ workbenchIndex, view, chooserOptions }) {
    const [editOpen, setEditOpen] = useState(false);
    const [ref, instance] = useLoadViewPlugin(view.id, workbenchIndex);
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
    const viewIndex = useMemo(() => {
        return findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]);
    }, [view.uniqueId, workbenchIndex, ordino.workbenches]);
    // eslint-disable-next-line no-empty-pattern
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.MOVE,
        item: { type: EDragTypes.MOVE, viewId: view.id, index: viewIndex },
    }), [view.id, viewIndex]);
    return (React.createElement("div", { ref: drop, id: view.id, className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" },
        workbenchIndex === ordino.focusViewIndex ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "view-actions" },
                React.createElement("button", { type: "button", onClick: () => dispatch(removeView({ workbenchIndex, viewIndex })), className: "btn-close" })),
            React.createElement("div", { ref: drag, className: "view-parameters d-flex" },
                React.createElement("div", null,
                    React.createElement("button", { type: "button", onClick: () => setEditOpen(!editOpen), className: "chevronButton btn btn-icon-primary align-middle m-1" },
                        ' ',
                        React.createElement("i", { className: "flex-grow-1 fas fa-bars m-1" }))),
                React.createElement("span", { className: "view-title row align-items-center m-1" },
                    React.createElement("strong", null, view.name))))) : (React.createElement("div", { ref: drag, className: "view-parameters d-flex" },
            React.createElement("span", { className: "view-title row align-items-center m-1" },
                React.createElement("strong", null, view.name)))),
        React.createElement("div", { ref: ref, className: "inner" }),
        isOver && canDrop ? React.createElement(DropOverlay, { view: view }) : null));
}
//# sourceMappingURL=WorkbenchRankingView.js.map