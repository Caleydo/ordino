/* eslint-disable no-param-reassign */
import * as React from 'react';
import { Suspense, useMemo, useState } from 'react';
import { IColumnDesc } from 'lineupjs';
import { EXTENSION_POINT_VISYN_VIEW, I18nextManager, IViewPluginDesc, PluginRegistry, useAsync } from 'tdp_core';
import { MosaicBranch, MosaicPath, MosaicWindow } from 'react-mosaic-component';

import {
  addFilter,
  addEntityFormatting,
  addScoreColumn,
  addSelection,
  createColumnDescs,
  removeView,
  setView,
  setViewParameters,
  setWorkbenchData,
  IWorkbenchView,
  IWorkbench,
} from '../../store';
import { findViewIndex, getAllFilters } from '../../store/storeUtils';

import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { EViewChooserMode, ViewChooser } from '../ViewChooser';
import { isVisynRankingViewDesc } from '../../views/interfaces';

export interface IWorkbenchGenericViewProps {
  workbenchIndex: number;
  view: IWorkbenchView;
  chooserOptions: IViewPluginDesc[];
  dragMode: boolean;
}

export function WorkbenchGenericView({
  workbenchIndex,
  view,
  chooserOptions,
  dragMode,
  path,
  setMosaicDrag,
  removeCallback,
}: {
  workbenchIndex: number;
  view: IWorkbenchView;
  chooserOptions: IViewPluginDesc[];
  dragMode: boolean;
  path: MosaicBranch[];
  setMosaicDrag: (b: boolean) => void;
  removeCallback: (path: MosaicPath) => void;
}) {
  const [editOpen, setEditOpen] = useState<boolean>(true);
  const [settingsTabSelected, setSettingsTabSelected] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const ordino = useAppSelector((state) => state.ordino);
  const plugin = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_VISYN_VIEW, view.id);

  const { value: viewPlugin } = useAsync(
    React.useCallback(
      () =>
        plugin.load().then((p) => {
          p.desc.uniqueId = view.uniqueId; // inject uniqueId to pluginDesc
          return p;
        }),
      [plugin, view.uniqueId],
    ),
    [],
  );

  const viewIndex = useMemo(() => {
    return findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]);
  }, [view.uniqueId, ordino.workbenches, workbenchIndex]);

  const onSelectionChanged = useMemo(() => (sel: string[]) => dispatch(addSelection({ workbenchIndex, newSelection: sel })), [dispatch, workbenchIndex]);
  const onParametersChanged = useMemo(
    () => (p: any) =>
      dispatch(setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]), parameters: p })),
    [dispatch, workbenchIndex, view.uniqueId, ordino.workbenches],
  );
  const onIdFilterChanged = useMemo(
    () => (filter) => dispatch(addFilter({ workbenchIndex, viewId: view.uniqueId, filter })),
    [dispatch, view.uniqueId, workbenchIndex],
  );
  const parameters = useMemo(() => {
    const previousWorkbench = ordino.workbenches?.[workbenchIndex - 1];
    const prevSelection = previousWorkbench ? previousWorkbench.selection : [];
    const { selectedMappings } = ordino.workbenches[workbenchIndex];
    return { prevSelection, selectedMappings };
  }, [workbenchIndex, ordino.workbenches]);

  const onDataChanged = useMemo(() => (data: any[]) => dispatch(setWorkbenchData({ workbenchIndex, data })), [dispatch, workbenchIndex]);
  const onAddFormatting = useMemo(
    () => (formatting: IWorkbench['formatting']) => dispatch(addEntityFormatting({ workbenchIndex, formatting })),
    [dispatch, workbenchIndex],
  );
  const onColumnDescChanged = useMemo(() => (desc: IColumnDesc) => dispatch(createColumnDescs({ workbenchIndex, desc })), [dispatch, workbenchIndex]);
  const onAddScoreColumn = useMemo(
    () => (desc: IColumnDesc, data: any[]) => dispatch(addScoreColumn({ workbenchIndex, desc, data })),
    [dispatch, workbenchIndex],
  );

  const header =
    workbenchIndex === ordino.focusWorkbenchIndex ? (
      <div className="d-flex w-100">
        <div className="view-parameters d-flex">
          <div>
            {!isVisynRankingViewDesc(viewPlugin?.desc) ? ( // do not show chooser for ranking views
              <button
                type="button"
                onClick={() => setEditOpen(!editOpen)}
                style={{ color: ordino.colorMap[ordino.workbenches[workbenchIndex].entityId] }}
                className="btn btn-icon-primary align-middle m-1"
              >
                <i className="flex-grow-1 fas fa-bars m-1" />
              </button>
            ) : null}
          </div>
          <span className="view-title row align-items-center m-1">
            <strong>{view.name}</strong>
          </span>
          {viewPlugin?.header ? (
            <Suspense fallback={I18nextManager.getInstance().i18n.t('tdp:ordino.views.loading')}>
              <viewPlugin.header
                desc={viewPlugin.desc}
                data={ordino.workbenches[workbenchIndex].data}
                columnDesc={ordino.workbenches[workbenchIndex].columnDescs}
                selection={ordino.workbenches[workbenchIndex].selection}
                filteredOutIds={getAllFilters(ordino.workbenches[workbenchIndex])}
                parameters={{ ...view.parameters, ...parameters }}
                onSelectionChanged={onSelectionChanged}
                onParametersChanged={onParametersChanged}
                onFilteredOutIdsChanged={onIdFilterChanged}
              />
            </Suspense>
          ) : null}
        </div>
        <div className="view-actions d-flex justify-content-end flex-grow-1">
          {!isVisynRankingViewDesc(viewPlugin?.desc) ? (
            <button
              type="button"
              onClick={() => {
                removeCallback(path);
                dispatch(removeView({ workbenchIndex, viewIndex }));
              }}
              className="btn btn-icon-dark align-middle m-1"
            >
              <i className="flex-grow-1 fas fa-times m-1" />
            </button>
          ) : null}
        </div>
      </div>
    ) : (
      <div className="view-parameters d-flex">
        <span className="view-title row align-items-center m-1">
          <strong>{viewPlugin?.desc?.itemName}</strong>
        </span>
      </div>
    );

  return (
    <MosaicWindow<number>
      path={path}
      title={view.name}
      renderToolbar={() => header}
      onDragStart={() => setMosaicDrag(true)}
      onDragEnd={() => setMosaicDrag(false)}
    >
      <div id={view.id} className={`position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1 ${dragMode ? 'pe-none' : ''}`}>
        <div className="inner d-flex">
          {editOpen && !isVisynRankingViewDesc(viewPlugin?.desc) ? ( // do not show chooser for ranking views
            <div className="d-flex flex-column">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${settingsTabSelected || !viewPlugin || !viewPlugin?.tab ? 'active' : ''}`}
                    onClick={() => setSettingsTabSelected(true)}
                    data-bs-toggle="tab"
                    data-bs-target="#home"
                    type="button"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    Views
                  </button>
                </li>
                {viewPlugin && viewPlugin?.tab ? (
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${!settingsTabSelected ? 'active' : ''}`}
                      onClick={() => setSettingsTabSelected(false)}
                      data-bs-toggle="tab"
                      data-bs-target="#profile"
                      type="button"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="false"
                    >
                      Settings
                    </button>
                  </li>
                ) : null}
              </ul>

              <div className="h-100 tab-content viewTabPanel" style={{ width: '220px' }}>
                <div
                  className={`h-100 tab-pane ${settingsTabSelected || !viewPlugin || !viewPlugin?.tab ? 'active' : ''}`}
                  role="tabpanel"
                  aria-labelledby="settings-tab"
                >
                  {/* TODO refactor view header such that the logic (using hooks) and the visual representation are separated */}
                  <ViewChooser
                    views={chooserOptions}
                    showBurgerMenu={false}
                    mode={EViewChooserMode.EMBEDDED}
                    onSelectedView={(newView: IViewPluginDesc) => {
                      dispatch(
                        setView({
                          workbenchIndex,
                          viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                          viewId: newView.id,
                          viewName: newView.name,
                        }),
                      );
                    }}
                    isEmbedded={false}
                  />
                </div>
                {viewPlugin && viewPlugin?.tab ? (
                  <div className={`tab-pane ${!settingsTabSelected ? 'active' : ''}`} role="tabpanel" aria-labelledby="view-tab">
                    <Suspense fallback={I18nextManager.getInstance().i18n.t('tdp:ordino.views.loading')}>
                      <viewPlugin.tab
                        desc={viewPlugin.desc}
                        data={ordino.workbenches[workbenchIndex].data}
                        columnDesc={ordino.workbenches[workbenchIndex].columnDescs}
                        selection={ordino.workbenches[workbenchIndex].selection}
                        filteredOutIds={getAllFilters(ordino.workbenches[workbenchIndex])}
                        parameters={{ ...view.parameters, ...parameters }}
                        onSelectionChanged={onSelectionChanged}
                        onParametersChanged={onParametersChanged}
                        onFilteredOutIdsChanged={onIdFilterChanged}
                      />
                    </Suspense>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          {viewPlugin?.view ? (
            <Suspense fallback={I18nextManager.getInstance().i18n.t('tdp:ordino.views.loading')}>
              <viewPlugin.view
                desc={viewPlugin.desc}
                data={ordino.workbenches[workbenchIndex].data}
                columnDesc={ordino.workbenches[workbenchIndex].columnDescs}
                selection={ordino.workbenches[workbenchIndex].selection}
                filteredOutIds={getAllFilters(ordino.workbenches[workbenchIndex])}
                parameters={{ ...view.parameters, ...parameters }}
                onSelectionChanged={onSelectionChanged}
                onParametersChanged={onParametersChanged}
                onFilteredOutIdsChanged={onIdFilterChanged}
                onDataChanged={onDataChanged}
                onAddFormatting={onAddFormatting}
                onColumnDescChanged={onColumnDescChanged}
                onAddScoreColumn={onAddScoreColumn}
              />
            </Suspense>
          ) : null}
        </div>
      </div>
    </MosaicWindow>
  );
}
