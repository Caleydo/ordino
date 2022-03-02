/* eslint-disable no-param-reassign */
import * as React from 'react';
import { Suspense, useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { EXTENSION_POINT_VISYN_VIEW, IViewPluginDesc, PluginRegistry, useAsync } from 'tdp_core';
import { addFilter, addSelection, IWorkbenchView, removeView, setView, setViewParameters } from '../../store';
import { findViewIndex, getAllFilters } from '../../store/storeUtils';
import { DropOverlay } from './DropOverlay';
import { EDragTypes } from './utils';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { EViewChooserMode, ViewChooser } from '../ViewChooser';

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
  const plugin = PluginRegistry.getInstance().getVisynPlugin(EXTENSION_POINT_VISYN_VIEW, view.id);

  const { value: viewPlugin } = useAsync(
    React.useMemo(
      () => () =>
        plugin.load().then((p) => {
          p.desc.uniqueId = view.uniqueId; // inject uniqueId to pluginDesc
          console.log('uniqueid', view.uniqueId);
          return p;
        }),
      [plugin, view.uniqueId],
    ),
    [],
  );
  const [viewPluginDesc, viewPluginComponents] = viewPlugin ? [viewPlugin.desc, viewPlugin.factory()] : [null, null];

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
    return findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]);
  }, [view.uniqueId, ordino.workbenches, workbenchIndex]);

  // eslint-disable-next-line no-empty-pattern
  const [{}, drag] = useDrag(
    () => ({
      type: EDragTypes.MOVE,
      item: { type: EDragTypes.MOVE, viewId: view.id, index: viewIndex },
    }),
    [view.id, viewIndex],
  );
  const onSelectionChanged = useMemo(() => (sel: string[]) => dispatch(addSelection({ workbenchIndex, newSelection: sel })), [workbenchIndex]);
  const onParametersChanged = useMemo(
    () => (p: any) =>
      dispatch(setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]), parameters: p })),
    [workbenchIndex, view.uniqueId, ordino.workbenches],
  );
  const onIdFilterChanged = useMemo(() => (filter) => dispatch(addFilter({ workbenchIndex, viewId: view.uniqueId, filter })), [workbenchIndex]);
  const parameters = useMemo(() => {
    const previousWorkbench = ordino.workbenches?.[workbenchIndex - 1];
    const prevSelection = previousWorkbench ? previousWorkbench.selection : [];
    const { selectedMappings } = ordino.workbenches[workbenchIndex];
    return { prevSelection, selectedMappings };
  }, [workbenchIndex, ordino.workbenches]);
  return (
    <div ref={drop} id={view.id} className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
      {workbenchIndex === ordino.focusViewIndex ? (
        <>
          <div className="view-actions">
            <button type="button" onClick={() => dispatch(removeView({ workbenchIndex, viewIndex }))} className="btn btn-icon-dark align-middle m-1">
              <i className="flex-grow-1 fas fa-times m-1" />
            </button>
          </div>

          <div ref={drag} className="view-parameters d-flex cursor-pointer">
            <div>
              <button
                type="button"
                onClick={() => setEditOpen(!editOpen)}
                style={{ color: ordino.colorMap[ordino.workbenches[workbenchIndex].entityId] }}
                className="btn btn-icon-primary align-middle m-1"
              >
                <i className="flex-grow-1 fas fa-bars m-1" />
              </button>
            </div>
            <span className="view-title row align-items-center m-1">
              <strong>{viewPluginDesc?.itemName}</strong>
            </span>
            {viewPluginComponents?.header ? (
              <Suspense fallback="Loading..">
                <viewPluginComponents.header
                  desc={viewPluginDesc}
                  data={ordino.workbenches[workbenchIndex].data}
                  dataDesc={ordino.workbenches[workbenchIndex].columnDescs}
                  selection={ordino.workbenches[workbenchIndex].selection}
                  idFilter={getAllFilters(ordino.workbenches[workbenchIndex])}
                  parameters={{ ...view.parameters, ...parameters }}
                  onSelectionChanged={onSelectionChanged}
                  onParametersChanged={onParametersChanged}
                  onIdFilterChanged={onIdFilterChanged}
                />
              </Suspense>
            ) : null}
          </div>
        </>
      ) : (
        <div ref={drag} className="view-parameters d-flex">
          <span className="view-title row align-items-center m-1">
            <strong>{viewPluginDesc?.itemName}</strong>
          </span>
        </div>
      )}
      <div className="inner d-flex">
        {editOpen && !viewPlugin?.desc.defaultView ? ( // do not show chooser for ranking views
          <div className="d-flex flex-column">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${settingsTabSelected || !viewPlugin || !viewPluginComponents?.tab ? 'active' : ''}`}
                  onClick={() => setSettingsTabSelected(true)}
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  Settings
                </button>
              </li>
              {viewPlugin && viewPluginComponents.tab ? (
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
                    View
                  </button>
                </li>
              ) : null}
            </ul>

            <div className="h-100 tab-content viewTabPanel" style={{ width: '220px' }}>
              <div
                className={`h-100 tab-pane ${settingsTabSelected || !viewPlugin || !viewPluginComponents?.tab ? 'active' : ''}`}
                role="tabpanel"
                aria-labelledby="settings-tab"
              >
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
              {viewPlugin && viewPluginComponents.tab ? (
                <div className={`tab-pane ${!settingsTabSelected ? 'active' : ''}`} role="tabpanel" aria-labelledby="view-tab">
                  <Suspense fallback="Loading..">
                    <viewPluginComponents.tab
                      desc={viewPluginDesc}
                      data={ordino.workbenches[workbenchIndex].data}
                      dataDesc={ordino.workbenches[workbenchIndex].columnDescs}
                      selection={ordino.workbenches[workbenchIndex].selection}
                      idFilter={getAllFilters(ordino.workbenches[workbenchIndex])}
                      parameters={{ ...view.parameters, ...parameters }}
                      onSelectionChanged={onSelectionChanged}
                      onParametersChanged={onParametersChanged}
                      onIdFilterChanged={onIdFilterChanged}
                    />
                  </Suspense>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        {viewPlugin ? (
          <Suspense fallback="Loading..">
            <viewPluginComponents.view
              desc={viewPluginDesc}
              data={ordino.workbenches[workbenchIndex].data}
              dataDesc={ordino.workbenches[workbenchIndex].columnDescs}
              selection={ordino.workbenches[workbenchIndex].selection}
              idFilter={getAllFilters(ordino.workbenches[workbenchIndex])}
              parameters={{ ...view.parameters, ...parameters }}
              onSelectionChanged={onSelectionChanged}
              onParametersChanged={onParametersChanged}
              onIdFilterChanged={onIdFilterChanged}
            />
          </Suspense>
        ) : null}
      </div>

      {isOver && canDrop ? <DropOverlay view={view} /> : null}
    </div>
  );
}
