import * as React from 'react';
import { Suspense, useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { EViewChooserMode, useAppDispatch, useAppSelector, ViewChooser } from '../..';
import { addFilter, addSelection, removeView, setView, setViewParameters } from '../../store';
import { findViewIndex, getAllFilters } from '../../store/storeUtils';
import { DropOverlay } from './DropOverlay';
import { EDragTypes } from './utils';
import { useVisynViewPlugin } from './useLoadWorkbenchViewPlugin';
export function WorkbenchGenericView({ workbenchIndex, view, chooserOptions, showChooser = true }) {
    const [editOpen, setEditOpen] = useState(true);
    const [viewPlugin, viewPluginFactFunc] = useVisynViewPlugin(view.id);
    const viewPluginComponents = useMemo(() => {
        return viewPluginFactFunc();
    }, [viewPlugin]);
    console.log(viewPluginComponents);
    const [settingsTabSelected, setSettingsTabSelected] = useState(false);
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
    console.log(ordino.workbenches);
    console.log(viewPlugin);
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
                            React.createElement("strong", null, view.name)),
                        (viewPluginComponents === null || viewPluginComponents === void 0 ? void 0 : viewPluginComponents.header) ?
                            React.createElement(Suspense, { fallback: 'Loading..' },
                                React.createElement(viewPluginComponents.header, { desc: viewPlugin, data: ordino.workbenches[workbenchIndex].data, dataDesc: ordino.workbenches[workbenchIndex].columnDescs, selection: ordino.workbenches[workbenchIndex].selection, idFilter: getAllFilters(ordino.workbenches[workbenchIndex]), parameters: view.parameters, onSelectionChanged: (sel) => dispatch(addSelection({ entityId: ordino.workbenches[workbenchIndex].entityId, newSelection: sel })), onParametersChanged: (p) => dispatch(setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]), parameters: p })), onIdFilterChanged: (filt) => dispatch(addFilter({ entityId: ordino.workbenches[workbenchIndex].entityId, viewId: view.id, filter: filt })) })) : null)) :
                React.createElement(React.Fragment, null,
                    React.createElement("div", { ref: drag, className: "view-parameters d-flex" },
                        React.createElement("span", { className: 'view-title row align-items-center m-1' },
                            React.createElement("strong", null, view.name)))),
            React.createElement("div", { className: "inner d-flex" },
                editOpen ? React.createElement(React.Fragment, null, !(viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc.isStartView) && React.createElement("div", { className: 'd-flex flex-column' },
                    React.createElement("ul", { className: "nav nav-tabs", id: "myTab", role: "tablist" },
                        React.createElement("li", { className: "nav-item", role: "presentation" },
                            React.createElement("button", { className: `nav-link ${settingsTabSelected || !viewPlugin || !(viewPluginComponents === null || viewPluginComponents === void 0 ? void 0 : viewPluginComponents.tab) ? 'active' : ''}`, onClick: () => setSettingsTabSelected(true), "data-bs-toggle": "tab", "data-bs-target": "#home", type: "button", role: "tab", "aria-controls": "home", "aria-selected": "true" }, "Settings")),
                        viewPlugin && viewPluginComponents.tab ?
                            React.createElement("li", { className: "nav-item", role: "presentation" },
                                React.createElement("button", { className: `nav-link ${!settingsTabSelected ? 'active' : ''}`, onClick: () => setSettingsTabSelected(false), "data-bs-toggle": "tab", "data-bs-target": "#profile", type: "button", role: "tab", "aria-controls": "profile", "aria-selected": "false" }, "View")) : null),
                    React.createElement("div", { className: "h-100 tab-content", style: { width: '220px' } },
                        React.createElement("div", { className: `h-100 tab-pane ${settingsTabSelected || !viewPlugin || !(viewPluginComponents === null || viewPluginComponents === void 0 ? void 0 : viewPluginComponents.tab) ? 'active' : ''}`, role: "tabpanel", "aria-labelledby": "settings-tab" },
                            React.createElement(ViewChooser, { views: chooserOptions, showBurgerMenu: false, mode: EViewChooserMode.EMBEDDED, onSelectedView: (newView) => {
                                    dispatch(setView({
                                        workbenchIndex,
                                        viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                                        viewId: newView.id,
                                        viewName: newView.name
                                    }));
                                }, isEmbedded: false })),
                        viewPlugin && viewPluginComponents.tab ?
                            React.createElement("div", { className: `tab-pane ${!settingsTabSelected ? 'active' : ''}`, role: "tabpanel", "aria-labelledby": "view-tab" },
                                React.createElement(Suspense, { fallback: 'Loading..' },
                                    React.createElement(viewPluginComponents.tab, { desc: viewPlugin, data: ordino.workbenches[workbenchIndex].data, dataDesc: ordino.workbenches[workbenchIndex].columnDescs, selection: ordino.workbenches[workbenchIndex].selection, idFilter: getAllFilters(ordino.workbenches[workbenchIndex]), parameters: view.parameters, onSelectionChanged: (sel) => dispatch(addSelection({ entityId: ordino.workbenches[workbenchIndex].entityId, newSelection: sel })), onParametersChanged: (p) => dispatch(setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]), parameters: p })), onIdFilterChanged: (filt) => dispatch(addFilter({ entityId: ordino.workbenches[workbenchIndex].entityId, viewId: view.id, filter: filt })) })))
                            : null)))
                    : null,
                viewPlugin ?
                    React.createElement(Suspense, { fallback: 'Loading..' },
                        React.createElement(viewPluginComponents.view, { desc: viewPlugin, data: ordino.workbenches[workbenchIndex].data, dataDesc: ordino.workbenches[workbenchIndex].columnDescs, selection: ordino.workbenches[workbenchIndex].selection, idFilter: getAllFilters(ordino.workbenches[workbenchIndex]), parameters: view.parameters, onSelectionChanged: (sel) => dispatch(addSelection({ entityId: ordino.workbenches[workbenchIndex].entityId, newSelection: sel })), onParametersChanged: (p) => dispatch(setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]), parameters: p })), onIdFilterChanged: (filt) => dispatch(addFilter({ entityId: ordino.workbenches[workbenchIndex].entityId, viewId: view.id, filter: filt })) })) : null),
            isOver && canDrop ? React.createElement(DropOverlay, { view: view }) : null)));
}
//# sourceMappingURL=WorkbenchGenericView.js.map