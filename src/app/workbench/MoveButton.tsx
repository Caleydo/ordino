import React from 'react';
import { useDrag } from 'react-dnd';
import { EDragTypes } from './utils';
import { findViewIndex } from '../../store/storeUtils';
import { IWorkbenchView } from '../../store/ordinoSlice';
import { useAppSelector } from '../../hooks/useAppSelector';

export interface IWorkbenchSingleViewProps {
  view: IWorkbenchView;
}

export function MoveButton({ view }: IWorkbenchSingleViewProps) {
  const ordino = useAppSelector((state) => state.ordino);

  // eslint-disable-next-line no-empty-pattern
  const [{}, drag] = useDrag(
    () => ({
      type: EDragTypes.MOVE,
      item: { type: EDragTypes.MOVE, viewId: view.id, index: findViewIndex(view.uniqueId, ordino.workbenches[ordino.focusWorkbenchIndex]) },
    }),
    [view.id, ordino.workbenches[ordino.focusWorkbenchIndex].views],
  );

  return (
    <button ref={drag} type="button" className="position-absolute btn btn-primary">
      Move View
    </button>
  );
}
