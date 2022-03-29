import * as React from 'react';
import { useMemo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { I18nextManager, IViewPluginDesc } from 'tdp_core';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { IWorkbenchView, removeView, setView } from '../../store';
import { findViewIndex } from '../../store/storeUtils';
import { EViewChooserMode, ViewChooser } from '../ViewChooser';
import { DropOverlay } from './DropOverlay';
import { EDragTypes } from './utils';

export interface IWorkbenchGenericViewProps {
  workbenchIndex: number;
  view: IWorkbenchView;
  chooserOptions: IViewPluginDesc[];
}

export function WorkbenchEmptyView({ workbenchIndex, view, chooserOptions }: IWorkbenchGenericViewProps) {
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
    return findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]);
  }, [ordino.workbenches, view.uniqueId, workbenchIndex]);

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
      {workbenchIndex === ordino.focusWorkbenchIndex ? (
        <>
          <div className="view-actions">
            <button type="button" onClick={() => dispatch(removeView({ workbenchIndex, viewIndex }))} className="btn btn-icon-dark align-middle m-1">
              <i className="flex-grow-1 fas fa-times m-1" />
            </button>
          </div>

          <div ref={drag} className="view-parameters d-flex">
            <div>
              {/* <button type="button" onClick={() => setEditOpen(!editOpen)} className="chevronButton btn btn-icon-primary align-middle m-1"> <i className="flex-grow-1 fas fa-bars m-1"/></button> */}
            </div>
          </div>
        </>
      ) : (
        <div ref={drag} className="view-parameters d-flex" />
      )}
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

      {isOver && canDrop ? <DropOverlay view={view} /> : null}
    </div>
  );
}
