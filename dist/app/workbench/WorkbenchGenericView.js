/* eslint-disable no-param-reassign */
import * as React from 'react';
import { Suspense, useMemo, useState } from 'react';
import { EXTENSION_POINT_VISYN_VIEW, I18nextManager, PluginRegistry, useAsync } from 'tdp_core';
import { addFilter, addEntityFormatting, addScoreColumn, addSelection, createColumnDescs, removeView, setView, setViewParameters, setWorkbenchData, } from '../../store';
import { findViewIndex, getAllFilters } from '../../store/storeUtils';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { EViewChooserMode, ViewChooser } from '../ViewChooser';
import { isVisynRankingViewDesc } from '../../views/interfaces';
export function WorkbenchGenericView({ workbenchIndex, view, chooserOptions }) {
    var _a;
    const [editOpen, setEditOpen] = useState(true);
    const [settingsTabSelected, setSettingsTabSelected] = useState(false);
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const plugin = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_VISYN_VIEW, view.id);
    const { value: viewPlugin } = useAsync(React.useCallback(() => plugin.load().then((p) => {
        p.desc.uniqueId = view.uniqueId; // inject uniqueId to pluginDesc
        return p;
    }), [plugin, view.uniqueId]), []);
    const viewIndex = useMemo(() => {
        return findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]);
    }, [view.uniqueId, ordino.workbenches, workbenchIndex]);
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
    const onAddFormatting = useMemo(() => (formatting) => dispatch(addEntityFormatting({ workbenchIndex, formatting })), [dispatch, workbenchIndex]);
    const onColumnDescChanged = useMemo(() => (desc) => dispatch(createColumnDescs({ workbenchIndex, desc })), [dispatch, workbenchIndex]);
    const onAddScoreColumn = useMemo(() => (desc, data) => dispatch(addScoreColumn({ workbenchIndex, desc, data })), [dispatch, workbenchIndex]);
    return (React.createElement("div", { id: view.id, className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" },
        workbenchIndex === ordino.focusWorkbenchIndex ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "view-actions" }, !isVisynRankingViewDesc(viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc) ? (React.createElement("button", { type: "button", onClick: () => dispatch(removeView({ workbenchIndex, viewIndex })), className: "btn btn-icon-dark align-middle m-1" },
                React.createElement("i", { className: "flex-grow-1 fas fa-times m-1" }))) : null),
            React.createElement("div", { className: "view-parameters d-flex cursor-pointer" },
                React.createElement("div", null, !isVisynRankingViewDesc(viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc) ? ( // do not show chooser for ranking views
                React.createElement("button", { type: "button", onClick: () => setEditOpen(!editOpen), style: { color: ordino.colorMap[ordino.workbenches[workbenchIndex].entityId] }, className: "btn btn-icon-primary align-middle m-1" },
                    React.createElement("i", { className: "flex-grow-1 fas fa-bars m-1" }))) : null),
                React.createElement("span", { className: "view-title row align-items-center m-1" },
                    React.createElement("strong", null, view.name)),
                (viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.header) ? (React.createElement(Suspense, { fallback: I18nextManager.getInstance().i18n.t('tdp:ordino.views.loading') },
                    React.createElement(viewPlugin.header, { desc: viewPlugin.desc, data: ordino.workbenches[workbenchIndex].data, columnDesc: ordino.workbenches[workbenchIndex].columnDescs, selection: ordino.workbenches[workbenchIndex].selection, filteredOutIds: getAllFilters(ordino.workbenches[workbenchIndex]), parameters: { ...view.parameters, ...parameters }, onSelectionChanged: onSelectionChanged, onParametersChanged: onParametersChanged, onFilteredOutIdsChanged: onIdFilterChanged }))) : null))) : (React.createElement("div", { className: "view-parameters d-flex" },
            React.createElement("span", { className: "view-title row align-items-center m-1" },
                React.createElement("strong", null, (_a = viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.desc) === null || _a === void 0 ? void 0 : _a.itemName)))),
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
                        React.createElement(ViewChooser, { views: chooserOptions, showBurgerMenu: false, mode: EViewChooserMode.EMBEDDED, onSelectedView: (newView) => {
                                dispatch(setView({
                                    workbenchIndex,
                                    viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                                    viewId: newView.id,
                                    viewName: newView.name,
                                }));
                            }, isEmbedded: false })),
                    viewPlugin && (viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.tab) ? (React.createElement("div", { className: `tab-pane ${!settingsTabSelected ? 'active' : ''}`, role: "tabpanel", "aria-labelledby": "view-tab" },
                        React.createElement(Suspense, { fallback: I18nextManager.getInstance().i18n.t('tdp:ordino.views.loading') },
                            React.createElement(viewPlugin.tab, { desc: viewPlugin.desc, data: ordino.workbenches[workbenchIndex].data, columnDesc: ordino.workbenches[workbenchIndex].columnDescs, selection: ordino.workbenches[workbenchIndex].selection, filteredOutIds: getAllFilters(ordino.workbenches[workbenchIndex]), parameters: { ...view.parameters, ...parameters }, onSelectionChanged: onSelectionChanged, onParametersChanged: onParametersChanged, onFilteredOutIdsChanged: onIdFilterChanged })))) : null))) : null,
            (viewPlugin === null || viewPlugin === void 0 ? void 0 : viewPlugin.view) ? (React.createElement(Suspense, { fallback: I18nextManager.getInstance().i18n.t('tdp:ordino.views.loading') },
                React.createElement(viewPlugin.view, { desc: viewPlugin.desc, data: ordino.workbenches[workbenchIndex].data, columnDesc: ordino.workbenches[workbenchIndex].columnDescs, selection: ordino.workbenches[workbenchIndex].selection, filteredOutIds: getAllFilters(ordino.workbenches[workbenchIndex]), parameters: { ...view.parameters, ...parameters }, onSelectionChanged: onSelectionChanged, onParametersChanged: onParametersChanged, onFilteredOutIdsChanged: onIdFilterChanged, onDataChanged: onDataChanged, onAddFormatting: onAddFormatting, onColumnDescChanged: onColumnDescChanged, onAddScoreColumn: onAddScoreColumn }))) : null)));
}
//# sourceMappingURL=WorkbenchGenericView.js.map