/* eslint-disable no-param-reassign */
import * as React from 'react';
import { Suspense, useMemo, useState } from 'react';
import { EXTENSION_POINT_VISYN_VIEW, I18nextManager, PluginRegistry, useAsync } from 'tdp_core';
import { MosaicWindow } from 'react-mosaic-component';
import { addFilter, addEntityFormatting, addScoreColumn, addSelection, createColumnDescs, removeView, setView, setViewParameters, setWorkbenchData, } from '../../store';
import { findViewIndex, getAllFilters } from '../../store/storeUtils';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { EViewChooserMode, ViewChooser } from '../ViewChooser';
import { isVisynRankingViewDesc } from '../../views/interfaces';
export function WorkbenchGenericView({ workbenchIndex, view, chooserOptions, mosaicDrag, path, removeCallback, }) {
    var _a;
    const [editOpen, setEditOpen] = useState(true);
    const [settingsTabSelected, setSettingsTabSelected] = useState(false);
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const currentWorkbench = ordino.workbenches[workbenchIndex];
    const plugin = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_VISYN_VIEW, view.id);
    const { value: viewPlugin } = useAsync(React.useCallback(() => plugin.load().then((p) => {
        p.desc.uniqueId = view.uniqueId; // inject uniqueId to pluginDesc
        return p;
    }), [plugin, view.uniqueId]), []);
    const viewIndex = useMemo(() => {
        return findViewIndex(view.uniqueId, currentWorkbench);
    }, [view.uniqueId, currentWorkbench]);
    const onSelectionChanged = useMemo(() => (sel) => dispatch(addSelection({ workbenchIndex, newSelection: sel })), [dispatch, workbenchIndex]);
    const onParametersChanged = useMemo(() => (p) => dispatch(setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, currentWorkbench), parameters: p })), [dispatch, workbenchIndex, view.uniqueId, currentWorkbench]);
    const onIdFilterChanged = useMemo(() => (filter) => dispatch(addFilter({ workbenchIndex, viewId: view.uniqueId, filter })), [dispatch, view.uniqueId, workbenchIndex]);
    const parameters = useMemo(() => {
        var _a;
        const previousWorkbench = (_a = ordino.workbenches) === null || _a === void 0 ? void 0 : _a[workbenchIndex - 1];
        const prevSelection = previousWorkbench ? previousWorkbench.selection : [];
        const { selectedMappings } = currentWorkbench;
        return { prevSelection, selectedMappings };
    }, [workbenchIndex, ordino.workbenches, currentWorkbench]);
    const onDataChanged = useMemo(() => (data) => dispatch(setWorkbenchData({ workbenchIndex, data })), [dispatch, workbenchIndex]);
    const onAddFormatting = useMemo(() => (formatting) => dispatch(addEntityFormatting({ workbenchIndex, formatting })), [dispatch, workbenchIndex]);
    const onColumnDescChanged = useMemo(() => (desc) => dispatch(createColumnDescs({ workbenchIndex, desc })), [dispatch, workbenchIndex]);
    const onAddScoreColumn = useMemo(() => (desc, data) => dispatch(addScoreColumn({ workbenchIndex, desc, data })), [dispatch, workbenchIndex]);
    // This memo is required to solve an infinite loop problem related to the filters. Because the currentWorkbench.views contains parameters, but
    // is a part of the views that filters relies on, the two references trade off swapping and create a loop if the parameters are changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const filteredOutIds = React.useMemo(() => getAllFilters(currentWorkbench), [JSON.stringify(currentWorkbench.views.map((v) => v.filters))]);
    const header = workbenchIndex === ordino.focusWorkbenchIndex ? (React.createElement("div", { className: "d-flex w-100" },
        React.createElement("div", { className: "view-parameters d-flex" },
            React.createElement("div", null, !isVisynRankingViewDesc(viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc) ? ( // do not show chooser for ranking views
            React.createElement("button", { type: "button", onClick: () => setEditOpen(!editOpen), style: { color: ordino.colorMap[currentWorkbench.entityId] }, className: "btn btn-icon-primary align-middle m-1" },
                React.createElement("i", { className: "flex-grow-1 fas fa-bars m-1" }))) : null),
            React.createElement("span", { className: "view-title row align-items-center m-1" },
                React.createElement("strong", null, view.name)),
            (viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.header) ? (React.createElement(Suspense, { fallback: I18nextManager.getInstance().i18n.t('tdp:ordino.views.loading') },
                React.createElement(viewPlugin.header, { desc: viewPlugin.desc, data: currentWorkbench.data, columnDesc: currentWorkbench.columnDescs, selection: currentWorkbench.selection, filteredOutIds: filteredOutIds, parameters: { ...view.parameters, ...parameters }, onSelectionChanged: onSelectionChanged, onParametersChanged: onParametersChanged, onFilteredOutIdsChanged: onIdFilterChanged }))) : null),
        React.createElement("div", { className: "view-actions d-flex justify-content-end flex-grow-1" }, !isVisynRankingViewDesc(viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc) ? (React.createElement("button", { type: "button", onClick: () => {
                removeCallback(path);
                dispatch(removeView({ workbenchIndex, viewIndex }));
            }, className: "btn btn-icon-dark align-middle m-1" },
            React.createElement("i", { className: "flex-grow-1 fas fa-times m-1" }))) : null))) : (React.createElement("div", { className: "view-parameters d-flex" },
        React.createElement("span", { className: "view-title row align-items-center m-1" },
            React.createElement("strong", null, (_a = viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc) === null || _a === void 0 ? void 0 : _a.itemName))));
    return (React.createElement(MosaicWindow, { path: path, title: view.name, renderToolbar: () => header },
        React.createElement("div", { id: view.id, className: `position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1 ${mosaicDrag ? 'pe-none' : ''}` },
            React.createElement("div", { className: "inner d-flex" },
                editOpen && !isVisynRankingViewDesc(viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc) ? ( // do not show chooser for ranking views
                React.createElement("div", { className: "d-flex flex-column" },
                    React.createElement("ul", { className: "nav nav-tabs", id: "myTab", role: "tablist" },
                        React.createElement("li", { className: "nav-item", role: "presentation" },
                            React.createElement("button", { className: `nav-link ${settingsTabSelected || !viewPlugin || !(viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.tab) ? 'active' : ''}`, onClick: () => setSettingsTabSelected(true), "data-bs-toggle": "tab", "data-bs-target": "#home", type: "button", role: "tab", "aria-controls": "home", "aria-selected": "true" }, "Views")),
                        viewPlugin && (viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.tab) ? (React.createElement("li", { className: "nav-item", role: "presentation" },
                            React.createElement("button", { className: `nav-link ${!settingsTabSelected ? 'active' : ''}`, onClick: () => setSettingsTabSelected(false), "data-bs-toggle": "tab", "data-bs-target": "#profile", type: "button", role: "tab", "aria-controls": "profile", "aria-selected": "false" }, "Settings"))) : null),
                    React.createElement("div", { className: "h-100 tab-content viewTabPanel", style: { width: '220px' } },
                        React.createElement("div", { className: `h-100 tab-pane ${settingsTabSelected || !viewPlugin || !(viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.tab) ? 'active' : ''}`, role: "tabpanel", "aria-labelledby": "settings-tab" },
                            React.createElement(ViewChooser, { views: chooserOptions, selectedView: viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc, showBurgerMenu: false, mode: EViewChooserMode.EMBEDDED, onSelectedView: (newView) => {
                                    dispatch(setView({
                                        workbenchIndex,
                                        viewIndex: findViewIndex(view.uniqueId, currentWorkbench),
                                        viewId: newView.id,
                                        viewName: newView.name,
                                    }));
                                }, isEmbedded: false })),
                        viewPlugin && (viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.tab) ? (React.createElement("div", { className: `tab-pane ${!settingsTabSelected ? 'active' : ''}`, role: "tabpanel", "aria-labelledby": "view-tab" },
                            React.createElement(Suspense, { fallback: I18nextManager.getInstance().i18n.t('tdp:ordino.views.loading') },
                                React.createElement(viewPlugin.tab, { desc: viewPlugin.desc, data: currentWorkbench.data, columnDesc: currentWorkbench.columnDescs, selection: currentWorkbench.selection, filteredOutIds: filteredOutIds, parameters: { ...view.parameters, ...parameters }, onSelectionChanged: onSelectionChanged, onParametersChanged: onParametersChanged, onFilteredOutIdsChanged: onIdFilterChanged })))) : null))) : null,
                (viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.view) ? (React.createElement(Suspense, { fallback: I18nextManager.getInstance().i18n.t('tdp:ordino.views.loading') },
                    React.createElement(viewPlugin.view, { desc: viewPlugin.desc, data: currentWorkbench.data, columnDesc: currentWorkbench.columnDescs, selection: currentWorkbench.selection, filteredOutIds: filteredOutIds, parameters: { ...view.parameters, ...parameters }, onSelectionChanged: onSelectionChanged, onParametersChanged: onParametersChanged, onFilteredOutIdsChanged: onIdFilterChanged, onDataChanged: onDataChanged, onAddFormatting: onAddFormatting, onColumnDescChanged: onColumnDescChanged, onAddScoreColumn: onAddScoreColumn }))) : null))));
}
//# sourceMappingURL=WorkbenchGenericView.js.map