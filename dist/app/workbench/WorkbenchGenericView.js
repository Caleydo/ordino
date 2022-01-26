import * as React from 'react';
import { useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { EViewChooserMode, useAppDispatch, useAppSelector, ViewChooser } from '../..';
import { removeView, setView } from '../../store';
import { findViewIndex, getAllFilters } from '../../store/storeUtils';
import { DropOverlay } from './DropOverlay';
import { EDragTypes } from './utils';
import { useVisynViewPlugin } from './useLoadWorkbenchViewPlugin';
export function WorkbenchGenericView({ workbenchIndex, view, chooserOptions }) {
    const [editOpen, setEditOpen] = useState(false);
    const viewPlugin = useVisynViewPlugin(view.id);
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
                        React.createElement("div", null,
                            React.createElement("button", { type: "button", onClick: () => setEditOpen(!editOpen), className: "chevronButton btn btn-icon-primary align-middle m-1" },
                                " ",
                                React.createElement("i", { className: "flex-grow-1 fas fa-bars m-1" }))),
                        React.createElement("span", { className: 'view-title row align-items-center m-1' },
                            React.createElement("strong", null, view.id)))) :
                React.createElement(React.Fragment, null,
                    React.createElement("div", { ref: drag, className: "view-parameters d-flex" },
                        React.createElement("span", { className: 'view-title row align-items-center m-1' },
                            React.createElement("strong", null, view.id)))),
            React.createElement("div", { className: "inner d-flex" },
                editOpen ? React.createElement(ViewChooser, { views: chooserOptions, showBurgerMenu: false, mode: EViewChooserMode.EMBEDDED, onSelectedView: (newView) => {
                        dispatch(setView({
                            workbenchIndex,
                            viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                            viewId: newView.id
                        }));
                    }, isEmbedded: false }) : null,
                viewPlugin ?
                    React.createElement(viewPlugin.factory, { desc: viewPlugin, data: ordino.workbenches[workbenchIndex].data, dataDesc: ordino.workbenches[workbenchIndex].columnDescs, selection: ordino.workbenches[workbenchIndex].selections, filters: getAllFilters(ordino.workbenches[workbenchIndex]), parameters: null, onSelectionChanged: () => console.log('selection changed'), onParametersChanged: () => console.log('param changed'), onFiltersChanged: () => console.log('filter changed') }) : null),
            isOver && canDrop ? React.createElement(DropOverlay, { view: view }) : null)));
}
//# sourceMappingURL=WorkbenchGenericView.js.map