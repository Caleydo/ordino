import * as React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../..';
import { removeView } from '../../store';
import { colorPalette } from '../Breadcrumb';
import { DropOverlay } from './DropOverlay';
import { useLoadViewPlugin } from './useLoadViewPlugin';
import { EDragTypes } from './utils';
export function WorkbenchRankingView({ workbenchIndex, view }) {
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
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.MOVE,
        item: { type: EDragTypes.MOVE, viewId: view.id, index: view.index },
    }), [view.id, view.index]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: drop, id: view.id, className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" },
            workbenchIndex === ordino.focusViewIndex ?
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "view-actions" },
                        React.createElement("button", { type: "button", onClick: () => dispatch(removeView({ workbenchIndex, viewIndex: view.index })), className: "btn-close" })),
                    React.createElement("div", { ref: drag, className: "view-parameters d-flex" },
                        React.createElement("div", null,
                            React.createElement("button", { type: "button", className: "chevronButton btn btn-outline-primary btn-sm align-middle m-1", style: { color: colorPalette[workbenchIndex], borderColor: colorPalette[workbenchIndex] } },
                                " ",
                                React.createElement("i", { className: "flex-grow-1 fas fa-chevron-right m-1" }),
                                "Edit View")),
                        React.createElement("span", { className: 'view-title row align-items-center m-1' },
                            React.createElement("strong", null, "Ranking")))) :
                React.createElement(React.Fragment, null,
                    React.createElement("div", { ref: drag, className: "view-parameters d-flex" },
                        React.createElement("span", { className: 'view-title row align-items-center m-1' },
                            React.createElement("strong", null, "Ranking")))),
            React.createElement("div", { ref: ref, className: "inner" }),
            isOver && canDrop ? React.createElement(DropOverlay, { view: view }) : null)));
}
//# sourceMappingURL=WorkbenchRankingView.js.map