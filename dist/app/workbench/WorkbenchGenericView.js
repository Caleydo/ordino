/* eslint-disable no-param-reassign */
import * as React from 'react';
import { Suspense, useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { EXTENSION_POINT_VISYN_VIEW, PluginRegistry, useAsync } from 'tdp_core';
import { addFilter, addScoreColumn, addSelection, createColumnDescs, removeView, setView, setViewParameters, setWorkbenchData, } from '../../store';
import { findViewIndex, getAllFilters } from '../../store/storeUtils';
import { DropOverlay } from './DropOverlay';
import { EDragTypes } from './utils';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { EViewChooserMode, ViewChooser } from '../ViewChooser';
export function WorkbenchGenericView({ workbenchIndex, view, chooserOptions }) {
    const [editOpen, setEditOpen] = useState(true);
    const [settingsTabSelected, setSettingsTabSelected] = useState(false);
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const plugin = PluginRegistry.getInstance().getVisynPlugin(EXTENSION_POINT_VISYN_VIEW, view.id);
    const { value: viewPlugin } = useAsync(React.useCallback(() => plugin.load(), [plugin]), []);
    const [viewPluginDesc, viewPluginComponents] = viewPlugin ? [viewPlugin.desc, viewPlugin.factory()] : [null, null];
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
    }, [view.uniqueId, ordino.workbenches, workbenchIndex]);
    // eslint-disable-next-line no-empty-pattern
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.MOVE,
        item: { type: EDragTypes.MOVE, viewId: view.id, index: viewIndex },
    }), [view.id, viewIndex]);
    const onSelectionChanged = useMemo(() => (sel) => dispatch(addSelection({ workbenchIndex, newSelection: sel })), [dispatch, workbenchIndex]);
    const onParametersChanged = useMemo(() => (p) => dispatch(setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]), parameters: p })), [dispatch, workbenchIndex, view.uniqueId, ordino.workbenches]);
    const onIdFilterChanged = useMemo(() => (filter) => dispatch(addFilter({ workbenchIndex, viewId: view.uniqueId, filter })), [dispatch, view.uniqueId, workbenchIndex]);
    const parameters = useMemo(() => {
        var _a;
        const previousWorkbench = (_a = ordino.workbenches) === null || _a === void 0 ? void 0 : _a[workbenchIndex - 1];
        const prevSelection = previousWorkbench ? previousWorkbench.selection : [];
        const { selectedMappings } = ordino.workbenches[workbenchIndex];
        return { prevSelection, selectedMappings };
    }, [workbenchIndex, ordino.workbenches]);
    const onDataChanged = useMemo(() => (data) => dispatch(setWorkbenchData({ workbenchIndex, data })), [dispatch, workbenchIndex]);
    const onColumnDescChanged = useMemo(() => (desc) => dispatch(createColumnDescs({ workbenchIndex, desc })), [dispatch, workbenchIndex]);
    const onAddScoreColumn = useMemo(() => (desc, data) => dispatch(addScoreColumn({ workbenchIndex, desc, data })), [dispatch, workbenchIndex]);
    // TODO: Eextend visyn view interface
    // TODO: Add proper interfaces to the dispatch callbacks
    return (React.createElement("div", { ref: drop, id: view.id, className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" },
        workbenchIndex === ordino.focusViewIndex ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "view-actions" }, !(viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc.defaultView) ? (React.createElement("button", { type: "button", onClick: () => dispatch(removeView({ workbenchIndex, viewIndex })), className: "btn btn-icon-dark align-middle m-1" },
                React.createElement("i", { className: "flex-grow-1 fas fa-times m-1" }))) : null),
            React.createElement("div", { ref: drag, className: "view-parameters d-flex cursor-pointer" },
                React.createElement("div", null, !(viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc.defaultView) ? ( // do not show chooser for ranking views
                React.createElement("button", { type: "button", onClick: () => setEditOpen(!editOpen), style: { color: ordino.colorMap[ordino.workbenches[workbenchIndex].entityId] }, className: "btn btn-icon-primary align-middle m-1" },
                    React.createElement("i", { className: "flex-grow-1 fas fa-bars m-1" }))) : null),
                React.createElement("span", { className: "view-title row align-items-center m-1" },
                    React.createElement("strong", null, view.name)),
                (viewPluginComponents === null || viewPluginComponents === void 0 ? void 0 : viewPluginComponents.header) ? (React.createElement(Suspense, { fallback: "Loading.." },
                    React.createElement(viewPluginComponents.header, { desc: viewPluginDesc, data: ordino.workbenches[workbenchIndex].data, dataDesc: ordino.workbenches[workbenchIndex].columnDescs, selection: ordino.workbenches[workbenchIndex].selection, idFilter: getAllFilters(ordino.workbenches[workbenchIndex]), parameters: { ...view.parameters, ...parameters }, onSelectionChanged: onSelectionChanged, onParametersChanged: onParametersChanged, onIdFilterChanged: onIdFilterChanged }))) : null))) : (React.createElement("div", { ref: drag, className: "view-parameters d-flex" },
            React.createElement("span", { className: "view-title row align-items-center m-1" },
                React.createElement("strong", null, viewPluginDesc === null || viewPluginDesc === void 0 ? void 0 : viewPluginDesc.itemName)))),
        React.createElement("div", { className: "inner d-flex" },
            editOpen && !(viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc.defaultView) ? ( // do not show chooser for ranking views
            React.createElement("div", { className: "d-flex flex-column" },
                React.createElement("ul", { className: "nav nav-tabs", id: "myTab", role: "tablist" },
                    React.createElement("li", { className: "nav-item", role: "presentation" },
                        React.createElement("button", { className: `nav-link ${settingsTabSelected || !viewPlugin || !(viewPluginComponents === null || viewPluginComponents === void 0 ? void 0 : viewPluginComponents.tab) ? 'active' : ''}`, onClick: () => setSettingsTabSelected(true), "data-bs-toggle": "tab", "data-bs-target": "#home", type: "button", role: "tab", "aria-controls": "home", "aria-selected": "true" }, "Views")),
                    viewPlugin && viewPluginComponents.tab ? (React.createElement("li", { className: "nav-item", role: "presentation" },
                        React.createElement("button", { className: `nav-link ${!settingsTabSelected ? 'active' : ''}`, onClick: () => setSettingsTabSelected(false), "data-bs-toggle": "tab", "data-bs-target": "#profile", type: "button", role: "tab", "aria-controls": "profile", "aria-selected": "false" }, "Settings"))) : null),
                React.createElement("div", { className: "h-100 tab-content viewTabPanel", style: { width: '220px' } },
                    React.createElement("div", { className: `h-100 tab-pane ${settingsTabSelected || !viewPlugin || !(viewPluginComponents === null || viewPluginComponents === void 0 ? void 0 : viewPluginComponents.tab) ? 'active' : ''}`, role: "tabpanel", "aria-labelledby": "settings-tab" },
                        React.createElement(ViewChooser, { views: chooserOptions, showBurgerMenu: false, mode: EViewChooserMode.EMBEDDED, onSelectedView: (newView) => {
                                dispatch(setView({
                                    workbenchIndex,
                                    viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                                    viewId: newView.id,
                                    viewName: newView.name,
                                }));
                            }, isEmbedded: false })),
                    viewPlugin && viewPluginComponents.tab ? (React.createElement("div", { className: `tab-pane ${!settingsTabSelected ? 'active' : ''}`, role: "tabpanel", "aria-labelledby": "view-tab" },
                        React.createElement(Suspense, { fallback: "Loading.." },
                            React.createElement(viewPluginComponents.tab, { desc: viewPluginDesc, data: ordino.workbenches[workbenchIndex].data, dataDesc: ordino.workbenches[workbenchIndex].columnDescs, selection: ordino.workbenches[workbenchIndex].selection, idFilter: getAllFilters(ordino.workbenches[workbenchIndex]), parameters: { ...view.parameters, ...parameters }, onSelectionChanged: onSelectionChanged, onParametersChanged: onParametersChanged, onIdFilterChanged: onIdFilterChanged })))) : null))) : null,
            viewPlugin ? (React.createElement(Suspense, { fallback: "Loading.." },
                React.createElement(viewPluginComponents.view, { desc: viewPluginDesc, data: ordino.workbenches[workbenchIndex].data, dataDesc: ordino.workbenches[workbenchIndex].columnDescs, selection: ordino.workbenches[workbenchIndex].selection, idFilter: getAllFilters(ordino.workbenches[workbenchIndex]), parameters: { ...view.parameters, ...parameters }, onSelectionChanged: onSelectionChanged, onParametersChanged: onParametersChanged, onIdFilterChanged: onIdFilterChanged, onDataChanged: onDataChanged, onColumnDescChanged: onColumnDescChanged, onAddScoreColumn: onAddScoreColumn }))) : null),
        isOver && canDrop ? React.createElement(DropOverlay, { view: view }) : null));
}
//# sourceMappingURL=WorkbenchGenericView.js.map