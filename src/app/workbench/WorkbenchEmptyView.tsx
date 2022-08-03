import * as React from 'react';
import { useMemo } from 'react';
import { MosaicBranch, MosaicPath, MosaicWindow } from 'react-mosaic-component';
import { I18nextManager, IViewPluginDesc } from 'tdp_core';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { IWorkbenchView } from '../../store';
import { removeView, setView } from '../../store/ordinoTrrackedSlice';
import { findViewIndex } from '../../store/storeUtils';
import { EViewChooserMode, ViewChooser } from '../viewChooser/ViewChooser';

export function WorkbenchEmptyView({
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
  const dispatch = useAppDispatch();

  const workbench = useAppSelector((state) => state.ordinoTracked.workbenches[workbenchIndex]);
  const focusIndex = useAppSelector((state) => state.ordinoTracked.focusWorkbenchIndex);

  const viewIndex = useMemo(() => {
    return findViewIndex(view.uniqueId, workbench);
  }, [workbench, view.uniqueId]);

  return (
    <MosaicWindow<string>
      path={path}
      title={view.name}
      renderToolbar={() =>
        workbenchIndex === focusIndex ? (
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
    >
      <div id={view.id} className={`position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1 ${mosaicDrag ? 'pe-none' : ''}`}>
        <div className="inner d-flex">
          <ViewChooser
            views={chooserOptions}
            showBurgerMenu={false}
            mode={EViewChooserMode.EMBEDDED}
            selectedView={null}
            onSelectedView={(newView: IViewPluginDesc) => {
              dispatch(
                setView({
                  workbenchIndex,
                  viewIndex: findViewIndex(view.uniqueId, workbench),
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
