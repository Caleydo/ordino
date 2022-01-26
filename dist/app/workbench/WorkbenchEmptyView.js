import * as React from 'react';
import { useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { EViewChooserMode, useAppDispatch, useAppSelector, ViewChooser } from '../..';
import { removeView, setView } from '../../store';
import { findViewIndex } from '../../store/storeUtils';
import { DropOverlay } from './DropOverlay';
import { EDragTypes } from './utils';
export function WorkbenchEmptyView({ workbenchIndex, view, chooserOptions }) {
    const [editOpen, setEditOpen] = useState(false);
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
    }, [ordino.workbenches[workbenchIndex].views]);
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.MOVE,
        item: { type: EDragTypes.MOVE, viewId: view.id, index: viewIndex },
    }), [view.id, viewIndex]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: drop, id: view.id, className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" },
            workbenchIndex === ordino.focusViewIndex ?
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "view-actions" },
                        React.createElement("button", { type: "button", onClick: () => dispatch(removeView({ workbenchIndex, viewIndex })), className: "btn-close" })),
                    React.createElement("div", { ref: drag, className: "view-parameters d-flex" },
                        React.createElement("div", null))) :
                React.createElement(React.Fragment, null,
                    React.createElement("div", { ref: drag, className: "view-parameters d-flex" })),
            React.createElement("div", { className: "inner d-flex" },
                React.createElement(ViewChooser, { views: chooserOptions, showBurgerMenu: false, mode: EViewChooserMode.EMBEDDED, onSelectedView: (newView) => {
                        dispatch(setView({
                            workbenchIndex,
                            viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                            viewId: newView.id
                        }));
                    }, isEmbedded: false }),
                React.createElement("div", { className: "w-100 d-flex justify-content-center align-items-center" },
                    React.createElement("p", { className: "emptyViewText" }, "Select A View"))),
            isOver && canDrop ? React.createElement(DropOverlay, { view: view }) : null)));
}
//# sourceMappingURL=WorkbenchEmptyView.js.map