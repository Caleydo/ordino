import * as React from 'react';
import { Suspense, useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IViewPluginDesc } from 'tdp_core';
import { addFilter, addSelection, IWorkbenchView, removeView, setView, setViewParameters } from '../../store';
import { findViewIndex, getAllFilters } from '../../store/storeUtils';
import { DropOverlay } from './DropOverlay';
import { EDragTypes } from './utils';
import { useVisynViewPlugin } from './useLoadWorkbenchViewPlugin';
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
  const [viewPlugin, viewPluginFactFunc] = useVisynViewPlugin(view.id);

  const viewPluginComponents = useMemo(() => {
    return viewPluginFactFunc();
  }, [viewPluginFactFunc]);

  const [settingsTabSelected, setSettingsTabSelected] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const ordino = useAppSelector((state) => state.ordino);
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
    console.log('in here');
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

  return (
    <div ref={drop} id={view.id} className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
      {workbenchIndex === ordino.focusViewIndex ? (
        <>
          <div className="view-actions">
            <button type="button" onClick={() => dispatch(removeView({ workbenchIndex, viewIndex }))} className="btn-close" />
          </div>

          <div ref={drag} className="view-parameters d-flex">
            <div>
              <button type="button" onClick={() => setEditOpen(!editOpen)} className="chevronButton btn btn-icon-primary align-middle m-1">
                {' '}
                <i className="flex-grow-1 fas fa-bars m-1" />
              </button>
            </div>
            <span className="view-title row align-items-center m-1">
              <strong>{view.id}</strong>
            </span>
            {viewPluginComponents?.header ? (
              <Suspense fallback="Loading..">
                <viewPluginComponents.header
                  desc={viewPlugin}
                  data={ordino.workbenches[workbenchIndex].data}
                  dataDesc={ordino.workbenches[workbenchIndex].columnDescs}
                  selection={ordino.workbenches[workbenchIndex].selection}
                  idFilter={getAllFilters(ordino.workbenches[workbenchIndex])}
                  parameters={view.parameters}
                  onSelectionChanged={(sel: string[]) => dispatch(addSelection({ newSelection: sel }))}
                  onParametersChanged={(p) =>
                    dispatch(setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]), parameters: p }))
                  }
                  onIdFilterChanged={(filt: string[]) => dispatch(addFilter({ viewId: view.id, filter: filt }))}
                />
              </Suspense>
            ) : null}
          </div>
        </>
      ) : (
        <div ref={drag} className="view-parameters d-flex">
          <span className="view-title row align-items-center m-1">
            <strong>{view.id}</strong>
          </span>
        </div>
      )}
      <div className="inner d-flex">
        {editOpen ? (
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

            <div className="h-100 tab-content" style={{ width: '220px' }}>
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
                      desc={viewPlugin}
                      data={ordino.workbenches[workbenchIndex].data}
                      dataDesc={ordino.workbenches[workbenchIndex].columnDescs}
                      selection={ordino.workbenches[workbenchIndex].selection}
                      idFilter={getAllFilters(ordino.workbenches[workbenchIndex])}
                      parameters={view.parameters}
                      onSelectionChanged={(sel: string[]) => dispatch(addSelection({ newSelection: sel }))}
                      onParametersChanged={(p) =>
                        dispatch(
                          setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]), parameters: p }),
                        )
                      }
                      onIdFilterChanged={(filt: string[]) => dispatch(addFilter({ viewId: view.id, filter: filt }))}
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
              desc={viewPlugin}
              data={ordino.workbenches[workbenchIndex].data}
              dataDesc={ordino.workbenches[workbenchIndex].columnDescs}
              selection={ordino.workbenches[workbenchIndex].selection}
              idFilter={getAllFilters(ordino.workbenches[workbenchIndex])}
              parameters={view.parameters}
              onSelectionChanged={(sel: string[]) => dispatch(addSelection({ newSelection: sel }))}
              onParametersChanged={(p) =>
                dispatch(setViewParameters({ workbenchIndex, viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]), parameters: p }))
              }
              onIdFilterChanged={(filt: string[]) => dispatch(addFilter({ viewId: view.id, filter: filt }))}
            />
          </Suspense>
        ) : null}
      </div>

      {isOver && canDrop ? <DropOverlay view={view} /> : null}
    </div>
  );
}
