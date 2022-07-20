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
import { isVisynRankingViewDesc } from '../../views/interfaces';
import { AnimatingOverlay } from './AnimatingOverlay';

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
  mosaicDrag,
  path,
  removeCallback,
}: {
  workbenchIndex: number;
  view: IWorkbenchView;
  chooserOptions: IViewPluginDesc[];
  mosaicDrag: boolean;
  path: MosaicBranch[];
  removeCallback: (path: MosaicPath) => void;
}) {
  const [editOpen, setEditOpen] = useState<boolean>(true);
  const [settingsTabSelected, setSettingsTabSelected] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const ordino = useAppSelector((state) => state.ordino);
  const currentWorkbench = ordino.workbenches[workbenchIndex];
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
    return findViewIndex(view.uniqueId, currentWorkbench);
  }, [view.uniqueId, currentWorkbench]);

  const onSelectionChanged = useMemo(() => (sel: string[]) => dispatch(addSelection({ workbenchIndex, newSelection: sel })), [dispatch, workbenchIndex]);
  const onParametersChanged = useMemo(
    () => (p: any) => dispatch(setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, currentWorkbench), parameters: p })),
    [dispatch, workbenchIndex, view.uniqueId, currentWorkbench],
  );
  const onIdFilterChanged = useMemo(
    () => (filter) => dispatch(addFilter({ workbenchIndex, viewId: view.uniqueId, filter })),
    [dispatch, view.uniqueId, workbenchIndex],
  );
  const parameters = useMemo(() => {
    const previousWorkbench = ordino.workbenches?.[workbenchIndex - 1];
    const prevSelection = previousWorkbench ? previousWorkbench.selection : [];
    const { selectedMappings } = currentWorkbench;
    return { prevSelection, selectedMappings };
  }, [workbenchIndex, ordino.workbenches, currentWorkbench]);

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

  // This memo is required to solve an infinite loop problem related to the filters. Because the currentWorkbench.views contains parameters, but
  // is a part of the views that filters relies on, the two references trade off swapping and create a loop if the parameters are changed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredOutIds = React.useMemo(() => getAllFilters(currentWorkbench), [JSON.stringify(currentWorkbench.views.map((v) => v.filters))]);

  const header =
    workbenchIndex === ordino.focusWorkbenchIndex ? (
      <div className="d-flex w-100">
        <div className="view-parameters d-flex">
          <div>
            {!isVisynRankingViewDesc(viewPlugin?.desc) && viewPlugin?.tab ? ( // do not show chooser for ranking views
              <button
                type="button"
                onClick={() => setEditOpen(!editOpen)}
                style={{ color: ordino.colorMap[currentWorkbench.entityId] }}
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
                data={currentWorkbench.data}
                columnDesc={currentWorkbench.columnDescs}
                selection={currentWorkbench.selection}
                filteredOutIds={filteredOutIds}
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
          <strong>{viewPlugin?.desc?.name}</strong>
        </span>
      </div>
    );

  return (
    <MosaicWindow<number> path={path} title={view.name} renderToolbar={() => header}>
      <div
        id={view.id}
        className={`position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1 ${mosaicDrag || ordino.isAnimating ? 'resizeCursor' : ''}`}
      >
        <AnimatingOverlay
          color={ordino.colorMap[currentWorkbench.entityId]}
          isAnimating={ordino.isAnimating || mosaicDrag}
          iconName={viewPlugin?.desc?.icon ? viewPlugin?.desc?.icon : 'fas fa-bars'}
        />

        <div className="inner d-flex">
          {editOpen && !isVisynRankingViewDesc(viewPlugin?.desc) && viewPlugin?.tab ? ( // do not show chooser for ranking views
            <div className="d-flex flex-column">
              <div className="h-100 tab-content viewTabPanel" style={{ width: '220px' }}>
                {viewPlugin && viewPlugin?.tab ? (
                  <div className={`tab-pane ${!settingsTabSelected ? 'active' : ''}`} role="tabpanel" aria-labelledby="view-tab">
                    <Suspense fallback={I18nextManager.getInstance().i18n.t('tdp:ordino.views.loading')}>
                      <viewPlugin.tab
                        desc={viewPlugin.desc}
                        data={currentWorkbench.data}
                        columnDesc={currentWorkbench.columnDescs}
                        selection={currentWorkbench.selection}
                        filteredOutIds={filteredOutIds}
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
                data={currentWorkbench.data}
                columnDesc={currentWorkbench.columnDescs}
                selection={currentWorkbench.selection}
                filteredOutIds={filteredOutIds}
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
