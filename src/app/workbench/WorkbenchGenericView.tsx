/* eslint-disable no-param-reassign */
import * as React from 'react';
import { Suspense, useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IColumnDesc } from 'lineupjs';
import { EXTENSION_POINT_VISYN_VIEW, I18nextManager, IViewPluginDesc, PluginRegistry, useAsync } from 'tdp_core';
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
import { DropOverlay } from './DropOverlay';
import { EDragTypes } from './utils';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { EViewChooserMode, ViewChooser } from '../ViewChooser';
import { isVisynRankingViewDesc } from '../../views/interfaces';

export interface IWorkbenchGenericViewProps {
  workbenchIndex: number;
  view: IWorkbenchView;
  chooserOptions: IViewPluginDesc[];
}

export function WorkbenchGenericView({ workbenchIndex, view, chooserOptions }: IWorkbenchGenericViewProps) {
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

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: [EDragTypes.MOVE],
      canDrop: (d: { type: EDragTypes; viewId: string }) => {
        return d.viewId !== view.id;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [view.id],
  );

  const viewIndex = useMemo(() => {
    return findViewIndex(view.uniqueId, currentWorkbench);
  }, [view.uniqueId, currentWorkbench]);

  // eslint-disable-next-line no-empty-pattern
  const [{}, drag] = useDrag(
    () => ({
      type: EDragTypes.MOVE,
      item: { type: EDragTypes.MOVE, viewId: view.id, index: viewIndex },
    }),
    [view.id, viewIndex],
  );
  const onSelectionChanged = useMemo(() => (sel: string[]) => dispatch(addSelection({ workbenchIndex, newSelection: sel })), [dispatch, workbenchIndex]);
  const onParametersChanged = useMemo(
    () => (p: any) =>
      dispatch(setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, currentWorkbench), parameters: p })),
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

  return (
    <div ref={drop} id={view.id} className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
      {workbenchIndex === ordino.focusWorkbenchIndex ? (
        <>
          <div className="view-actions">
            {!isVisynRankingViewDesc(viewPlugin?.desc) ? (
              <button type="button" onClick={() => dispatch(removeView({ workbenchIndex, viewIndex }))} className="btn btn-icon-dark align-middle m-1">
                <i className="flex-grow-1 fas fa-times m-1" />
              </button>
            ) : null}
          </div>

          <div ref={drag} className="view-parameters d-flex cursor-pointer">
            <div>
              {!isVisynRankingViewDesc(viewPlugin?.desc) ? ( // do not show chooser for ranking views
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
        </>
      ) : (
        <div ref={drag} className="view-parameters d-flex">
          <span className="view-title row align-items-center m-1">
            <strong>{viewPlugin?.desc?.itemName}</strong>
          </span>
        </div>
      )}
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
                        viewIndex: findViewIndex(view.uniqueId, currentWorkbench),
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

      {isOver && canDrop ? <DropOverlay view={view} /> : null}
    </div>
  );
}
