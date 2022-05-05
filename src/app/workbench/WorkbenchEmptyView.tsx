import * as React from 'react';
import { useMemo } from 'react';
import { MosaicBranch, MosaicPath, MosaicWindow } from 'react-mosaic-component';
import { I18nextManager, IViewPluginDesc } from 'tdp_core';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { IWorkbenchView, removeView, setView } from '../../store';
import { findViewIndex } from '../../store/storeUtils';
import { EViewChooserMode, ViewChooser } from '../ViewChooser';

export function WorkbenchEmptyView({
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
  const dispatch = useAppDispatch();

  const ordino = useAppSelector((state) => state.ordino);

  const viewIndex = useMemo(() => {
    return findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]);
  }, [ordino.workbenches, view.uniqueId, workbenchIndex]);

  return (
    <MosaicWindow<string>
      path={path}
      title={view.name}
      renderToolbar={() =>
        workbenchIndex === ordino.focusWorkbenchIndex ? (
          <div className="d-flex w-100">
            <div className="view-actions d-flex justify-content-end flex-grow-1">
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
            </div>
          </div>
        ) : (
          <div className="view-parameters d-flex" />
        )
      }
      onDragStart={() => setMosaicDrag(true)}
      onDragEnd={() => setMosaicDrag(false)}
    >
      <div id={view.id} className={`position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1 ${dragMode ? 'pe-none' : ''}`}>
        <div className="inner d-flex">
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
          <div className="w-100 d-flex justify-content-center align-items-center">
            <p className="emptyViewText">{I18nextManager.getInstance().i18n.t('tdp:ordino.views.selectView')}</p>
          </div>
        </div>
      </div>
    </MosaicWindow>
  );
}
